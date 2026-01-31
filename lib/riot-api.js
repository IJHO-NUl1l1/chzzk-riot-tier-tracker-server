/**
 * Riot API utilities
 */
import axios from 'axios';
import { LRUCache } from 'lru-cache';

// Cache setup (1000 items, 5 minutes TTL)
const cache = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 5 // 5 minutes
});

// Region to platform routing
const REGION_TO_PLATFORM = {
  'kr': 'kr',
  'jp': 'jp1',
  'na': 'na1',
  'euw': 'euw1',
  'eune': 'eun1',
  'br': 'br1',
  'lan': 'la1',
  'las': 'la2',
  'oce': 'oc1',
  'ru': 'ru',
  'tr': 'tr1'
};

// Region to routing value mapping
const REGION_TO_ROUTING = {
  'kr': 'asia',
  'jp': 'asia',
  'na': 'americas',
  'br': 'americas',
  'lan': 'americas',
  'las': 'americas',
  'oce': 'sea',
  'euw': 'europe',
  'eune': 'europe',
  'tr': 'europe',
  'ru': 'europe'
};

/**
 * Get the appropriate host for a region
 * @param {string} region - Region code
 * @returns {string|null} Region host
 */
export function getRegionHost(region) {
  const platform = REGION_TO_PLATFORM[region.toLowerCase()];
  return platform ? `${platform}.api.riotgames.com` : null;
}

/**
 * Get routing value for a region
 * @param {string} region - Region code
 * @returns {string} Routing value
 */
export function getRoutingValue(region) {
  return REGION_TO_ROUTING[region.toLowerCase()] || 'asia';
}

// Base URLs for different regions
const getRegionalUrl = (region) => {
  const platform = REGION_TO_PLATFORM[region] || 'kr';
  return `https://${platform}.api.riotgames.com`;
};

// API URLs
const getAccountUrl = (region) => `https://${getRoutingValue(region)}.api.riotgames.com`;

/**
 * Get summoner info by name
 * @param {string} region - Region code
 * @param {string} summonerName - Summoner name
 * @returns {Promise<Object>} Summoner info
 */
export async function getSummonerByName(region, summonerName) {
  const cacheKey = `summoner:${region}:name:${summonerName}`;
  
  // Check cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for ${cacheKey}`);
    return cachedData;
  }
  
  try {
    const headers = {};
    
    // Use API key for authentication
    if (process.env.RIOT_API_KEY) {
      console.log('Using API key for authentication');
      headers['X-Riot-Token'] = process.env.RIOT_API_KEY;
      console.log('API Key (first 8 chars):', process.env.RIOT_API_KEY.substring(0, 8) + '...');
    } else {
      console.log('No API key available');
      throw new Error('No API key available');
    }
    
    const url = `${getRegionalUrl(region)}/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`;
    console.log('Making API request to:', url);
    console.log('With headers:', { 
      hasAuth: !!headers['Authorization'], 
      hasApiKey: !!headers['X-Riot-Token'] 
    });
    
    const response = await axios.get(url, { headers });
    
    console.log('API response status:', response.status);
    
    // Cache the result
    cache.set(cacheKey, response.data);
    
    return response.data;
  } catch (error) {
    console.error('Summoner info error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error.response?.data || error;
  }
}

// Other API functions removed - not needed for simplified API