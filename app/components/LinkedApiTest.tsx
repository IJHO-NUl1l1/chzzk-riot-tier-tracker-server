'use client';

import { useState } from 'react';
import ApiResponseVisualizer from './ApiResponseVisualizer';

interface LinkedApiTestProps {
  initialPuuid?: string;
  region?: string;
}

export default function LinkedApiTest({ initialPuuid = '', region = 'kr' }: LinkedApiTestProps) {
  const [puuid, setPuuid] = useState(initialPuuid);
  const [selectedRegion, setSelectedRegion] = useState(region);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const runLinkedTest = async () => {
    if (!puuid) {
      setError('PUUID is required');
      return;
    }
    
    setLoading(true);
    setStep(1);
    setError(null);
    setResults({});
    
    try {
      // 1. 소환사 정보 조회
      const summonerResponse = await fetch(`/api/riot/summoner/${selectedRegion}/${encodeURIComponent(puuid)}`);
      const summonerData = await summonerResponse.json();
      
      if (summonerData.error) {
        throw new Error(`Summoner API error: ${summonerData.error}`);
      }
      
      setResults(prev => ({ ...prev, summoner: summonerData }));
      setStep(2);
      
      // 2. 랭크 정보 조회
      const leagueResponse = await fetch(`/api/riot/league/${selectedRegion}/${encodeURIComponent(puuid)}`);
      const leagueData = await leagueResponse.json();
      
      if (leagueData.error) {
        throw new Error(`League API error: ${leagueData.error}`);
      }
      
      setResults(prev => ({ ...prev, league: leagueData }));
      setStep(3);
      
      // 3. 챔피언 숙련도 조회 (상위 5개)
      const masteryResponse = await fetch(`/api/riot/mastery/${selectedRegion}/${encodeURIComponent(puuid)}?count=5`);
      const masteryData = await masteryResponse.json();
      
      if (masteryData.error) {
        throw new Error(`Mastery API error: ${masteryData.error}`);
      }
      
      setResults(prev => ({ ...prev, mastery: masteryData }));
      setStep(4);
      
      // 4. 매치 히스토리 조회 (최근 5개)
      const matchHistoryResponse = await fetch(`/api/riot/match/${selectedRegion}/history/${encodeURIComponent(puuid)}?count=5`);
      const matchHistoryData = await matchHistoryResponse.json();
      
      if (matchHistoryData.error) {
        throw new Error(`Match history API error: ${matchHistoryData.error}`);
      }
      
      setResults(prev => ({ ...prev, matchHistory: matchHistoryData }));
      setStep(5);
      
    } catch (error: any) {
      console.error('Linked API test error:', error);
      setError(error.message || 'An error occurred during the linked API test');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-300">PUUID 기반 연계 테스트</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-blue-300">PUUID</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            value={puuid}
            onChange={(e) => setPuuid(e.target.value)}
            placeholder="Enter PUUID"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-blue-300">Region</label>
          <select
            className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="kr">Korea (KR)</option>
            <option value="jp">Japan (JP)</option>
            <option value="na">North America (NA)</option>
            <option value="euw">Europe West (EUW)</option>
            <option value="eune">Europe Nordic & East (EUNE)</option>
            <option value="br">Brazil (BR)</option>
          </select>
        </div>
      </div>
      
      <button
        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
        onClick={runLinkedTest}
        disabled={loading || !puuid}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Running Tests...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Run Linked API Tests</span>
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-4 bg-red-900/30 border border-red-700 p-4 rounded-lg text-red-200">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* Progress indicator */}
      {(step > 0 || Object.keys(results).length > 0) && (
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm text-gray-400">{step}/5</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${results.summoner ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
              Summoner Info
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${results.league ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
              League Info
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${results.mastery ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
              Champion Mastery
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${results.matchHistory ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
              Match History
            </div>
          </div>
        </div>
      )}
      
      {/* Results */}
      {results.summoner && (
        <ApiResponseVisualizer data={results.summoner} title="Summoner Information" />
      )}
      
      {results.league && (
        <ApiResponseVisualizer data={results.league} title="League Information" />
      )}
      
      {results.mastery && (
        <ApiResponseVisualizer data={results.mastery} title="Champion Mastery (Top 5)" />
      )}
      
      {results.matchHistory && (
        <ApiResponseVisualizer data={results.matchHistory} title="Match History (Recent 5)" />
      )}
    </div>
  );
}
