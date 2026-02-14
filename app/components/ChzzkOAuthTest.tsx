'use client';

import { useState, useEffect } from 'react';

function ResultBox({ result, loading }: { result: any; loading?: boolean }) {
  if (loading) {
    return <div className="mt-3 text-gray-400 text-sm">Loading...</div>;
  }
  if (!result) return null;

  const isError = result.error;
  return (
    <div className={`mt-3 rounded-lg p-4 overflow-x-auto ${isError ? 'bg-red-900/30 border border-red-700' : 'bg-gray-900'}`}>
      <pre className={`text-sm whitespace-pre-wrap ${isError ? 'text-red-300' : 'text-green-300'}`}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}

export default function ChzzkOAuthTest() {
  const [oauthStatus, setOauthStatus] = useState<'idle' | 'redirecting' | 'success' | 'error'>('idle');

  // User Lookup
  const [channelName, setChannelName] = useState('');
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  // Shared userId for other operations
  const [userId, setUserId] = useState('');

  // Refresh Token
  const [refreshResult, setRefreshResult] = useState<any>(null);
  const [refreshLoading, setRefreshLoading] = useState(false);

  // Revoke Token
  const [revokeResult, setRevokeResult] = useState<any>(null);
  const [revokeLoading, setRevokeLoading] = useState(false);

  // Delete User
  const [deleteResult, setDeleteResult] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Check if we came back from OAuth success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth') === 'success') {
      setOauthStatus('success');
      window.history.replaceState({}, '', '/test');
    }
  }, []);

  const startOAuth = () => {
    setOauthStatus('redirecting');
    window.location.href = '/api/chzzk/auth?redirect=/test?oauth=success';
  };

  const lookupUser = async () => {
    if (!channelName.trim()) return;
    setLookupLoading(true);
    setLookupResult(null);
    try {
      const res = await fetch(`/api/chzzk/user?channelName=${encodeURIComponent(channelName.trim())}`);
      const data = await res.json();
      setLookupResult(data);
      // Auto-fill userId if found
      if (data.user?.id) {
        setUserId(data.user.id);
      }
    } catch (err: any) {
      setLookupResult({ error: err.message });
    } finally {
      setLookupLoading(false);
    }
  };

  const refreshToken = async () => {
    if (!userId.trim()) return;
    setRefreshLoading(true);
    setRefreshResult(null);
    try {
      const res = await fetch('/api/chzzk/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim() }),
      });
      const data = await res.json();
      setRefreshResult(data);
    } catch (err: any) {
      setRefreshResult({ error: err.message });
    } finally {
      setRefreshLoading(false);
    }
  };

  const revokeToken = async () => {
    if (!userId.trim()) return;
    setRevokeLoading(true);
    setRevokeResult(null);
    try {
      const res = await fetch('/api/chzzk/auth/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim() }),
      });
      const data = await res.json();
      setRevokeResult(data);
    } catch (err: any) {
      setRevokeResult({ error: err.message });
    } finally {
      setRevokeLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!userId.trim()) return;
    setDeleteLoading(true);
    setDeleteResult(null);
    try {
      const res = await fetch('/api/chzzk/user/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim() }),
      });
      const data = await res.json();
      setDeleteResult(data);
      setDeleteConfirm(false);
    } catch (err: any) {
      setDeleteResult({ error: err.message });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section 1: OAuth Login */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2 text-green-400">1. Chzzk OAuth Login</h2>
        <p className="text-gray-500 text-xs mb-4">
          GET /api/chzzk/auth → chzzk login → callback → DB save
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={startOAuth}
            disabled={oauthStatus === 'redirecting'}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {oauthStatus === 'redirecting' ? 'Redirecting...' : 'Start Chzzk OAuth'}
          </button>
          {oauthStatus === 'success' && (
            <span className="text-green-400 text-sm font-medium">OAuth completed!</span>
          )}
        </div>
      </div>

      {/* Section 2: User Lookup */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2 text-blue-400">2. User Lookup</h2>
        <p className="text-gray-500 text-xs mb-4">
          GET /api/chzzk/user?channelName=... → user info + token status
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookupUser()}
            placeholder="치지직 채널명"
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={lookupUser}
            disabled={lookupLoading || !channelName.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Lookup
          </button>
        </div>
        <ResultBox result={lookupResult} loading={lookupLoading} />
      </div>

      {/* userId input - shared across sections 3-5 */}
      <div className="bg-gray-700/50 rounded-lg p-4">
        <label className="text-gray-400 text-sm block mb-2">
          User ID (Lookup 성공 시 자동 입력, 또는 직접 입력)
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="UUID (e.g. a1b2c3d4-...)"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 font-mono text-sm"
        />
      </div>

      {/* Section 3: Refresh Token */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2 text-purple-400">3. Refresh Token</h2>
        <p className="text-gray-500 text-xs mb-4">
          POST /api/chzzk/auth/refresh — DB의 refresh token으로 새 access + refresh token 발급
        </p>
        <button
          onClick={refreshToken}
          disabled={refreshLoading || !userId.trim()}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          {refreshLoading ? 'Refreshing...' : 'Refresh Token'}
        </button>
        <ResultBox result={refreshResult} loading={refreshLoading} />
      </div>

      {/* Section 4: Revoke Token (Logout) */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2 text-orange-400">4. Revoke Token (Logout)</h2>
        <p className="text-gray-500 text-xs mb-4">
          POST /api/chzzk/auth/revoke — 치지직 API에 revoke 요청 + DB에서 토큰 삭제
        </p>
        <button
          onClick={revokeToken}
          disabled={revokeLoading || !userId.trim()}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          {revokeLoading ? 'Revoking...' : 'Revoke Token'}
        </button>
        <ResultBox result={revokeResult} loading={revokeLoading} />
      </div>

      {/* Section 5: Delete User */}
      <div className="bg-gray-800 rounded-lg p-6 border border-red-900/50">
        <h2 className="text-xl font-semibold mb-2 text-red-400">5. Delete User (Withdrawal)</h2>
        <p className="text-gray-500 text-xs mb-4">
          DELETE /api/chzzk/user/delete — 토큰 revoke + chzzk_tokens + riot_tokens + tier_cache + users 전부 삭제
        </p>
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            disabled={!userId.trim()}
            className="px-6 py-2 bg-red-800 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Delete User...
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-red-400 text-sm">정말 삭제하시겠습니까?</span>
            <button
              onClick={deleteUser}
              disabled={deleteLoading}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
        <ResultBox result={deleteResult} loading={deleteLoading} />
      </div>

      {/* Section 6: API Reference */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">API Reference</h2>
        <div className="font-mono text-sm space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-green-900 text-green-300 rounded text-xs w-16 text-center">GET</span>
            <code className="text-gray-300">/api/chzzk/auth</code>
            <span className="text-gray-600 text-xs">OAuth 로그인 시작</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-green-900 text-green-300 rounded text-xs w-16 text-center">GET</span>
            <code className="text-gray-300">/api/chzzk/auth/callback</code>
            <span className="text-gray-600 text-xs">OAuth 콜백 (자동)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-green-900 text-green-300 rounded text-xs w-16 text-center">GET</span>
            <code className="text-gray-300">/api/chzzk/user?channelName=</code>
            <span className="text-gray-600 text-xs">유저 조회</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-blue-900 text-blue-300 rounded text-xs w-16 text-center">POST</span>
            <code className="text-gray-300">/api/chzzk/auth/refresh</code>
            <span className="text-gray-600 text-xs">토큰 갱신</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-blue-900 text-blue-300 rounded text-xs w-16 text-center">POST</span>
            <code className="text-gray-300">/api/chzzk/auth/revoke</code>
            <span className="text-gray-600 text-xs">토큰 revoke (로그아웃)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-red-900 text-red-300 rounded text-xs w-16 text-center">DELETE</span>
            <code className="text-gray-300">/api/chzzk/user/delete</code>
            <span className="text-gray-600 text-xs">유저 삭제 (탈퇴)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
