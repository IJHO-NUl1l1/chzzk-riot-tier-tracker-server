'use client';

import { useState } from 'react';
import ApiResponseVisualizer from '../components/ApiResponseVisualizer';
import LinkedApiTest from '../components/LinkedApiTest';

export default function TestPage() {
  const [summonerName, setSummonerName] = useState('Hide on bush');
  const [tagLine, setTagLine] = useState('KR1');
  const [region, setRegion] = useState('kr');
  const [apiResult, setApiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'linked'>('account');

  // Fetch summoner information
  const fetchSummonerInfo = async () => {
    if (!summonerName) {
      alert('Please enter a summoner name');
      return;
    }

    if (!tagLine) {
      alert('Please enter a tag line');
      return;
    }

    // 소환사 이름 처리
    let gameName = summonerName;

    // # 기호가 포함되어 있는 경우 자동으로 분리
    if (summonerName.includes('#')) {
      const parts = summonerName.split('#');
      gameName = parts[0];
      setTagLine(parts[1]);
    }

    setLoading(true);
    try {
      // 서버 측 API를 통해 Riot API 호출
      const response = await fetch(`/api/riot/account/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
      const data = await response.json();
      setApiResult(data);
    } catch (error) {
      console.error('Error:', error);
      setApiResult({ error: 'Failed to get account info' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Riot API Test Console</h1>
        <p className="text-gray-300 mb-6">Test various Riot API endpoints and view the results.</p>

        {/* Tab navigation */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('account')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'account'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
            >
              Account Lookup
            </button>
            <button
              onClick={() => setActiveTab('linked')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'linked'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
            >
              Linked API Tests
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'account' ? (
        <>
          {/* Account lookup form */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-6 text-white">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Riot ID Lookup</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-blue-300">Region</label>
              <select
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="kr">Korea (KR)</option>
                <option value="jp">Japan (JP)</option>
                <option value="na">North America (NA)</option>
                <option value="euw">Europe West (EUW)</option>
                <option value="eune">Europe Nordic & East (EUNE)</option>
                <option value="br">Brazil (BR)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-blue-300">Game Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                placeholder="Hide on bush"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-blue-300">Tag Line</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                value={tagLine}
                onChange={(e) => setTagLine(e.target.value)}
                placeholder="KR1"
              />
            </div>

            <button
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              onClick={fetchSummonerInfo}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Lookup Account</span>
                </>
              )}
            </button>
          </div>

          {/* Results display */}
          {apiResult && (
            <ApiResponseVisualizer data={apiResult} title="Account Information" />
          )}
        </>
      ) : (
        <LinkedApiTest />
      )}

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p> {new Date().getFullYear()} Chzzk LoL Tier API Test Console</p>
      </footer>
    </div>
  );
}