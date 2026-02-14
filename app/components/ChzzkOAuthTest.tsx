'use client';

import { useState, useEffect } from 'react';

interface TokenInfo {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

interface UserInfo {
  id: string;
  chzzk_channel_id: string;
  chzzk_channel_name: string;
  riot_puuid: string | null;
  riot_game_name: string | null;
  riot_tag_line: string | null;
  created_at: string;
  updated_at: string;
}

export default function ChzzkOAuthTest() {
  const [oauthStatus, setOauthStatus] = useState<'idle' | 'redirecting' | 'success' | 'error'>('idle');
  const [dbCheckResult, setDbCheckResult] = useState<any>(null);
  const [dbCheckLoading, setDbCheckLoading] = useState(false);
  const [channelName, setChannelName] = useState('');

  // Check if we came back from OAuth success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth') === 'success') {
      setOauthStatus('success');
      // Clean up URL
      window.history.replaceState({}, '', '/test');
    }
  }, []);

  const startOAuth = () => {
    setOauthStatus('redirecting');
    window.location.href = '/api/chzzk/auth?redirect=/test?oauth=success';
  };

  const checkUserInDb = async () => {
    if (!channelName.trim()) return;
    setDbCheckLoading(true);
    setDbCheckResult(null);

    try {
      const res = await fetch(`/api/chzzk/user?channelName=${encodeURIComponent(channelName.trim())}`);
      const data = await res.json();
      setDbCheckResult(data);
    } catch (err: any) {
      setDbCheckResult({ error: err.message });
    } finally {
      setDbCheckLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 1: OAuth Login Test */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-green-400">1. Chzzk OAuth Login</h2>
        <p className="text-gray-400 text-sm mb-4">
          치지직 OAuth 로그인 플로우를 테스트합니다. 버튼을 누르면 치지직 로그인 페이지로 이동합니다.
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
            <span className="text-green-400 text-sm font-medium">
              OAuth completed successfully!
            </span>
          )}
          {oauthStatus === 'error' && (
            <span className="text-red-400 text-sm font-medium">
              OAuth failed. Check console for details.
            </span>
          )}
        </div>

        <div className="mt-4 text-gray-500 text-xs">
          <p>Flow: /api/chzzk/auth → chzzk.naver.com/account-interlock → /api/chzzk/auth/callback → DB save → redirect back</p>
        </div>
      </div>

      {/* Section 2: DB Lookup */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">2. DB User Lookup</h2>
        <p className="text-gray-400 text-sm mb-4">
          치지직 채널명으로 DB에 저장된 유저를 조회합니다.
        </p>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkUserInDb()}
            placeholder="치지직 채널명 입력"
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={checkUserInDb}
            disabled={dbCheckLoading || !channelName.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            {dbCheckLoading ? 'Loading...' : 'Lookup'}
          </button>
        </div>

        {dbCheckResult && (
          <div className="mt-4">
            {dbCheckResult.error ? (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <p className="text-red-400 text-sm">{dbCheckResult.error}</p>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-300 text-sm whitespace-pre-wrap">
                  {JSON.stringify(dbCheckResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 3: OAuth Flow Diagram */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400">3. OAuth Flow Reference</h2>
        <div className="font-mono text-sm text-gray-300 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 w-6">1.</span>
            <span className="text-gray-400">Browser</span>
            <span className="text-gray-600">→</span>
            <code className="text-blue-300">GET /api/chzzk/auth</code>
            <span className="text-gray-500 text-xs ml-2">(state 쿠키 설정)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 w-6">2.</span>
            <span className="text-gray-400">Redirect</span>
            <span className="text-gray-600">→</span>
            <code className="text-blue-300">chzzk.naver.com/account-interlock</code>
            <span className="text-gray-500 text-xs ml-2">(유저 로그인)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 w-6">3.</span>
            <span className="text-gray-400">Callback</span>
            <span className="text-gray-600">→</span>
            <code className="text-blue-300">GET /api/chzzk/auth/callback?code=...&state=...</code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 w-6">4.</span>
            <span className="text-gray-400">Server</span>
            <span className="text-gray-600">→</span>
            <code className="text-green-300">POST openapi.chzzk.naver.com/auth/v1/token</code>
            <span className="text-gray-500 text-xs ml-2">(code → token)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 w-6">5.</span>
            <span className="text-gray-400">Server</span>
            <span className="text-gray-600">→</span>
            <code className="text-green-300">GET openapi.chzzk.naver.com/open/v1/users/me</code>
            <span className="text-gray-500 text-xs ml-2">(유저 정보)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 w-6">6.</span>
            <span className="text-gray-400">Server</span>
            <span className="text-gray-600">→</span>
            <code className="text-purple-300">Supabase UPSERT</code>
            <span className="text-gray-500 text-xs ml-2">(users + chzzk_tokens)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 w-6">7.</span>
            <span className="text-gray-400">Redirect</span>
            <span className="text-gray-600">→</span>
            <code className="text-blue-300">/auth/success</code>
            <span className="text-gray-500 text-xs ml-2">(완료)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
