/**
 * TFT Match API - Get match history by PUUID
 */
import { NextRequest } from 'next/server';
import axios from 'axios';
import { getRoutingValue } from '../../../../../../../../lib/riot-api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ region: string; puuid: string }> }
) {
  try {
    const params = await context.params;
    const region = params.region ? params.region.toLowerCase() : '';
    const puuid = params.puuid ? decodeURIComponent(params.puuid) : '';

    const { searchParams } = new URL(request.url);
    const count = searchParams.get('count') ? parseInt(searchParams.get('count') as string) : 20;
    const start = searchParams.get('start') ? parseInt(searchParams.get('start') as string) : 0;

    if (!region || !puuid) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const headers: Record<string, string> = {};
    if (process.env.RIOT_TFT_API_KEY) {
      headers['X-Riot-Token'] = process.env.RIOT_TFT_API_KEY;
    } else {
      throw new Error('No TFT API key available');
    }

    const routingValue = getRoutingValue(region);
    const queryParams = new URLSearchParams();
    queryParams.append('start', start.toString());
    queryParams.append('count', count.toString());

    const url = `https://${routingValue}.api.riotgames.com/tft/match/v1/matches/by-puuid/${encodeURIComponent(puuid)}/ids?${queryParams.toString()}`;
    const response = await axios.get(url, { headers });
    return Response.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    return Response.json({
      error: error.message || 'Failed to get TFT match history',
      status,
      details: error.response?.data || 'API call failed'
    }, { status });
  }
}
