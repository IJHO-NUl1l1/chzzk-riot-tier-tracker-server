/**
 * TFT Match API - Get match details by match ID
 */
import { NextRequest } from 'next/server';
import axios from 'axios';
import { getRoutingValue } from '../../../../../../../lib/riot-api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ region: string; matchId: string }> }
) {
  try {
    const params = await context.params;
    const region = params.region ? params.region.toLowerCase() : '';
    const matchId = params.matchId ? params.matchId : '';

    if (!region || !matchId) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const headers: Record<string, string> = {};
    if (process.env.RIOT_TFT_API_KEY) {
      headers['X-Riot-Token'] = process.env.RIOT_TFT_API_KEY;
    } else {
      throw new Error('No TFT API key available');
    }

    const routingValue = getRoutingValue(region);
    const url = `https://${routingValue}.api.riotgames.com/tft/match/v1/matches/${matchId}`;
    const response = await axios.get(url, { headers });
    return Response.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    return Response.json({
      error: error.message || 'Failed to get TFT match details',
      status,
      details: error.response?.data || 'API call failed'
    }, { status });
  }
}
