/**
 * TFT Account API - Get account by Riot ID (using TFT API key)
 */
import { NextRequest } from 'next/server';
import axios from 'axios';
import { getRoutingValue } from '../../../../../../../../lib/riot-api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ gameName: string; tagLine: string }> }
) {
  try {
    const params = await context.params;
    const gameName = params.gameName ? decodeURIComponent(params.gameName) : '';
    const tagLine = params.tagLine ? decodeURIComponent(params.tagLine) : '';

    if (!gameName || !tagLine) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const headers: Record<string, string> = {};
    if (process.env.RIOT_TFT_API_KEY) {
      headers['X-Riot-Token'] = process.env.RIOT_TFT_API_KEY;
    } else {
      throw new Error('No TFT API key available');
    }

    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || 'kr';
    const routingValue = getRoutingValue(region);

    const url = `https://${routingValue}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
    const response = await axios.get(url, { headers });
    return Response.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    return Response.json({
      error: error.message || 'Failed to get account info',
      status,
      details: error.response?.data || 'API call failed'
    }, { status });
  }
}
