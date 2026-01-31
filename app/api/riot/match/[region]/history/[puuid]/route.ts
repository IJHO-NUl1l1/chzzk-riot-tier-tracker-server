/**
 * Riot Match API - Get match history by PUUID
 */
import { NextRequest } from 'next/server';
import axios from 'axios';
import { getRegionHost } from '../../../../../../../lib/riot-api';

// Map region to routing value for match-v5 API
function getRoutingValue(region: string): string {
  const regionMapping: Record<string, string> = {
    'br': 'americas',
    'eune': 'europe',
    'euw': 'europe',
    'jp': 'asia',
    'kr': 'asia',
    'lan': 'americas',
    'las': 'americas',
    'na': 'americas',
    'oce': 'sea',
    'tr': 'europe',
    'ru': 'europe',
  };
  
  return regionMapping[region.toLowerCase()] || 'asia';
}

// In Next.js 16, params is a Promise that needs to be awaited
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ region: string; puuid: string }> }
) {
  try {
    // Await the params Promise
    const params = await context.params;
    
    // Extract and decode parameters
    const region = params.region ? params.region.toLowerCase() : '';
    const puuid = params.puuid ? decodeURIComponent(params.puuid) : '';
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const count = searchParams.get('count') ? parseInt(searchParams.get('count') as string) : 20;
    const start = searchParams.get('start') ? parseInt(searchParams.get('start') as string) : 0;
    const queue = searchParams.get('queue') || undefined;
    const type = searchParams.get('type') || undefined;
    
    console.log('Request parameters:', { region, puuid, count, start, queue, type });
    console.log('API Key available:', !!process.env.RIOT_API_KEY);
    
    // Validate parameters
    if (!region || !puuid) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Call Riot API
    try {
      const headers: Record<string, string> = {};
      
      // Use API key for authentication
      if (process.env.RIOT_API_KEY) {
        console.log('Using API key for authentication');
        headers['X-Riot-Token'] = process.env.RIOT_API_KEY;
      } else {
        console.log('No API key available');
        throw new Error('No API key available');
      }
      
      // Get the routing value for match-v5 API
      const routingValue = getRoutingValue(region);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('start', start.toString());
      queryParams.append('count', count.toString());
      
      if (queue) {
        queryParams.append('queue', queue);
      }
      
      if (type) {
        queryParams.append('type', type);
      }
      
      const url = `https://${routingValue}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?${queryParams.toString()}`;
      console.log('Making API request to:', url);
      
      const response = await axios.get(url, { headers });
      
      console.log('API response status:', response.status);
      
      return Response.json(response.data);
    } catch (apiError: any) {
      console.error('API call error:', apiError);
      
      // Extract detailed error information
      const errorStatus = apiError.response?.status;
      const errorMessage = apiError.message || 'Unknown error';
      
      return Response.json({ 
        error: errorMessage,
        status: errorStatus,
        details: apiError.response?.data || 'API call failed'
      }, { status: errorStatus || 500 });
    }
  } catch (error: any) {
    console.error('Match history error:', error.message);
    return Response.json({ 
      error: 'Failed to get match history', 
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
