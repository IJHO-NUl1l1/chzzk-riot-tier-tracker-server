/**
 * Riot Account API - Get account by Riot ID
 */
import { NextRequest } from 'next/server';
import axios from 'axios';

// In Next.js 16, params is a Promise that needs to be awaited
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ gameName: string; tagLine: string }> }
) {
  try {
    // Await the params Promise
    const params = await context.params;
    
    // Extract and decode parameters
    const gameName = params.gameName ? decodeURIComponent(params.gameName) : '';
    const tagLine = params.tagLine ? decodeURIComponent(params.tagLine) : '';
    
    console.log('Request parameters:', { gameName, tagLine });
    console.log('API Key available:', !!process.env.RIOT_LOL_API_KEY);
    
    // Validate parameters
    if (!gameName || !tagLine) {
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
      
      // Asia is the routing value for KR, JP regions
      const url = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
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
    console.error('Account info error:', error.message);
    return Response.json({ 
      error: 'Failed to get account info', 
      message: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
