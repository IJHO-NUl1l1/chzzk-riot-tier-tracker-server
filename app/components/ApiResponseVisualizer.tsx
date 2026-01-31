'use client';

import { useState } from 'react';

interface ApiResponseVisualizerProps {
  data: any;
  title?: string;
}

export default function ApiResponseVisualizer({ data, title }: ApiResponseVisualizerProps) {
  const [viewMode, setViewMode] = useState<'pretty' | 'raw'>('pretty');
  
  if (!data) return null;
  
  // Account info visualization
  if (data.puuid && data.gameName) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-6">
        {title && <h3 className="text-xl font-semibold mb-4 text-blue-300">{title}</h3>}
        
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'pretty' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => setViewMode('pretty')}
            >
              Pretty
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'raw' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => setViewMode('raw')}
            >
              Raw JSON
            </button>
          </div>
        </div>
        
        {viewMode === 'pretty' ? (
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4 text-2xl font-bold">
                {data.gameName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold">{data.gameName}</h3>
                <p className="text-gray-300">#{data.tagLine}</p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">PUUID:</span>
                <p className="font-mono text-blue-300 text-sm break-all">{data.puuid}</p>
              </div>
              {data.accountId && (
                <div className="bg-gray-800 p-3 rounded-lg">
                  <span className="text-gray-400 text-sm">Account ID:</span>
                  <p className="font-mono text-blue-300 text-sm break-all">{data.accountId}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <pre className="bg-gray-900 p-5 rounded-lg overflow-auto max-h-96 text-blue-100 font-mono text-sm border border-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    );
  }
  
  // Summoner info visualization
  if (data.id && data.name && data.summonerLevel) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-6">
        {title && <h3 className="text-xl font-semibold mb-4 text-blue-300">{title}</h3>}
        
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'pretty' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => setViewMode('pretty')}
            >
              Pretty
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'raw' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => setViewMode('raw')}
            >
              Raw JSON
            </button>
          </div>
        </div>
        
        {viewMode === 'pretty' ? (
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4 text-2xl font-bold">
                {data.profileIconId && (
                  <img 
                    src={`https://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${data.profileIconId}.png`} 
                    alt="Profile Icon" 
                    className="w-full h-full rounded-full"
                  />
                )}
                {!data.profileIconId && data.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold">{data.name}</h3>
                <p className="text-gray-300">Level {data.summonerLevel}</p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">Summoner ID:</span>
                <p className="font-mono text-blue-300 text-sm break-all">{data.id}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">PUUID:</span>
                <p className="font-mono text-blue-300 text-sm break-all">{data.puuid}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">Account ID:</span>
                <p className="font-mono text-blue-300 text-sm break-all">{data.accountId}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <span className="text-gray-400 text-sm">Last Updated:</span>
                <p className="font-mono text-blue-300 text-sm">
                  {new Date(data.revisionDate).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <pre className="bg-gray-900 p-5 rounded-lg overflow-auto max-h-96 text-blue-100 font-mono text-sm border border-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    );
  }
  
  // League entries visualization
  if (Array.isArray(data) && data.length > 0 && data[0].queueType && data[0].tier) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-6">
        {title && <h3 className="text-xl font-semibold mb-4 text-blue-300">{title}</h3>}
        
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'pretty' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => setViewMode('pretty')}
            >
              Pretty
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'raw' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => setViewMode('raw')}
            >
              Raw JSON
            </button>
          </div>
        </div>
        
        {viewMode === 'pretty' ? (
          <div className="space-y-4">
            {data.map((entry: any, index: number) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">
                    {entry.queueType === 'RANKED_SOLO_5x5' ? 'Ranked Solo/Duo' : 
                     entry.queueType === 'RANKED_FLEX_SR' ? 'Ranked Flex' : entry.queueType}
                  </h4>
                  <div className="flex items-center">
                    <div className="bg-blue-900 text-blue-100 px-3 py-1 rounded-lg text-sm font-medium">
                      {entry.tier} {entry.rank}
                    </div>
                    <span className="ml-2 text-yellow-400 font-bold">{entry.leaguePoints} LP</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-gray-800 p-2 rounded-lg text-center">
                    <div className="text-green-400 font-bold text-lg">{entry.wins}</div>
                    <div className="text-xs text-gray-400">Wins</div>
                  </div>
                  <div className="bg-gray-800 p-2 rounded-lg text-center">
                    <div className="text-red-400 font-bold text-lg">{entry.losses}</div>
                    <div className="text-xs text-gray-400">Losses</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(entry.wins / (entry.wins + entry.losses) * 100).toFixed(1)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 text-center">
                    Win Rate: {((entry.wins / (entry.wins + entry.losses)) * 100).toFixed(1)}%
                  </div>
                </div>
                
                {entry.miniSeries && (
                  <div className="mt-3 bg-gray-800 p-2 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Promotion Series:</div>
                    <div className="flex justify-center space-x-1">
                      {entry.miniSeries.progress.split('').map((char: string, i: number) => (
                        <div 
                          key={i} 
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                            ${char === 'W' ? 'bg-green-600 text-white' : 
                              char === 'L' ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                          {char === 'W' ? 'W' : char === 'L' ? 'L' : '?'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <pre className="bg-gray-900 p-5 rounded-lg overflow-auto max-h-96 text-blue-100 font-mono text-sm border border-gray-700">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    );
  }
  
  // Default JSON display for other data types
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-6">
      {title && <h3 className="text-xl font-semibold mb-4 text-blue-300">{title}</h3>}
      <pre className="bg-gray-900 p-5 rounded-lg overflow-auto max-h-96 text-blue-100 font-mono text-sm border border-gray-700">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
