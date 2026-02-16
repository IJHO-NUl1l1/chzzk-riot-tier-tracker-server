/**
 * Tier Cache API
 * GET  /api/chzzk/tier-cache?chzzkChannelId=xxx — Check if tier_cache entries exist for a user
 * POST /api/chzzk/tier-cache — Upsert LoL/TFT tier data into tier_cache table
 */
import { NextRequest } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const chzzkChannelId = request.nextUrl.searchParams.get('chzzkChannelId');

  if (!chzzkChannelId) {
    return Response.json({ error: 'chzzkChannelId parameter is required' }, { status: 400 });
  }

  const { data, error } = await getSupabase()
    .from('tier_cache')
    .select('game_type, tier, rank, league_points, riot_puuid, cached_at')
    .eq('chzzk_channel_id', chzzkChannelId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    linked: data.length > 0,
    entries: data,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chzzkChannelId, entries } = body;

    if (!chzzkChannelId) {
      return Response.json({ error: 'chzzkChannelId is required' }, { status: 400 });
    }

    if (!Array.isArray(entries) || entries.length === 0) {
      return Response.json({ error: 'entries array is required and must not be empty' }, { status: 400 });
    }

    // Verify the user exists
    const { data: user, error: userError } = await getSupabase()
      .from('users')
      .select('id, chzzk_channel_id, riot_puuid')
      .eq('chzzk_channel_id', chzzkChannelId)
      .single();

    if (userError || !user) {
      return Response.json({ error: 'User not found', chzzkChannelId }, { status: 404 });
    }

    const results = [];

    for (const entry of entries) {
      const { riotPuuid, gameType, queueType, tier, rank, leaguePoints, wins, losses } = entry;

      if (!riotPuuid || !gameType) {
        results.push({ gameType: gameType ?? 'unknown', error: 'riotPuuid and gameType are required' });
        continue;
      }

      if (!['lol', 'tft'].includes(gameType)) {
        results.push({ gameType, error: 'gameType must be "lol" or "tft"' });
        continue;
      }

      const { data, error } = await getSupabase()
        .from('tier_cache')
        .upsert(
          {
            chzzk_channel_id: chzzkChannelId,
            riot_puuid: riotPuuid,
            game_type: gameType,
            queue_type: queueType ?? null,
            tier: tier ?? null,
            rank: rank ?? null,
            league_points: leaguePoints ?? 0,
            wins: wins ?? 0,
            losses: losses ?? 0,
            cached_at: new Date().toISOString(),
          },
          { onConflict: 'riot_puuid,game_type' }
        )
        .select()
        .single();

      if (error) {
        results.push({ gameType, error: error.message });
      } else {
        results.push({ gameType, success: true, data });
      }
    }

    return Response.json({ results });
  } catch (error: any) {
    return Response.json({
      error: 'Invalid request body',
      message: error.message,
    }, { status: 400 });
  }
}
