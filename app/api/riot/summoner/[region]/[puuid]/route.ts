/**
 * Riot Summoner API - Get summoner by PUUID
 */
import { NextRequest } from 'next/server';
import axios from 'axios';
import { getRegionHost } from '../../../../../../lib/riot-api';

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
    
    console.log('Request parameters:', { region, puuid });
    console.log('API Key available:', !!process.env.RIOT_LOL_API_KEY);
    
    // Validate parameters
    if (!region || !puuid) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Call Riot API
    try {
      const headers: Record<string, string> = {};
      
      // Use API key for authentication
      if (process.env.RIOT_LOL_API_KEY) {
        console.log('Using API key for authentication');
        headers['X-Riot-Token'] = process.env.RIOT_LOL_API_KEY;
      } else {
        console.log('No API key available');
        throw new Error('No API key available');
      }
      
      // Get the appropriate host for the region
      const regionHost = getRegionHost(region);
      if (!regionHost) {
        return Response.json({ error: 'Invalid region' }, { status: 400 });
      }
      
      const url = `https://${regionHost}/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`;
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
    console.error('Summoner info error:', error.message);
    return Response.json({ 
      error: 'Failed to get summoner info', 
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
