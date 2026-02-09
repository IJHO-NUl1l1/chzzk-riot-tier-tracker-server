'use client';

import { useState } from 'react';
import LinkedApiTest from '../components/LinkedApiTest';
import TftLinkedApiTest from '../components/TftLinkedApiTest';

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<'lol' | 'tft'>('lol');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Riot API Test Console</h1>
        <p className="text-gray-300 mb-6">Test various Riot API endpoints and view the results.</p>

        {/* Tab navigation */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('lol')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'lol'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
            >
              LoL Linked API Tests
            </button>
            <button
              onClick={() => setActiveTab('tft')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'tft'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
            >
              TFT Linked API Tests
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'lol' ? (
        <LinkedApiTest />
      ) : (
        <TftLinkedApiTest />
      )}

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p> {new Date().getFullYear()} Chzzk LoL Tier API Test Console</p>
      </footer>
    </div>
  );
}
