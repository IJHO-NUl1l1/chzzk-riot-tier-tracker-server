/**
 * TFT Spectator API - Get active game by PUUID
 */
import { NextRequest } from 'next/server';
import axios from 'axios';
import { getRegionHost } from '../../../../../../../lib/riot-api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ region: string; puuid: string }> }
) {
  try {
    const params = await context.params;
    const region = params.region ? params.region.toLowerCase() : '';
    const puuid = params.puuid ? decodeURIComponent(params.puuid) : '';

    if (!region || !puuid) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const headers: Record<string, string> = {};
    if (process.env.RIOT_TFT_API_KEY) {
      headers['X-Riot-Token'] = process.env.RIOT_TFT_API_KEY;
    } else {
      throw new Error('No TFT API key available');
    }

    const regionHost = getRegionHost(region);
    if (!regionHost) {
      return Response.json({ error: 'Invalid region' }, { status: 400 });
    }

    const url = `https://${regionHost}/lol/spectator/tft/v5/active-games/by-puuid/${encodeURIComponent(puuid)}`;
    const response = await axios.get(url, { headers });
    return Response.json(response.data);
  } catch (error: any) {
    if (error.response?.status === 404) {
      return Response.json({ inGame: false, message: 'Summoner is not in an active TFT game' });
    }
    const status = error.response?.status || 500;
    return Response.json({
      error: error.message || 'Failed to get TFT active game info',
      status,
      details: error.response?.data || 'API call failed'
    }, { status });
  }
}
