/**
 * Public Tier Lookup API
 * GET /api/tier?chzzk_name=닉네임 — Look up tier data by Chzzk display name (for chat badge)
 */
import { NextRequest } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const chzzkName = request.nextUrl.searchParams.get('chzzk_name');

  if (!chzzkName) {
    return Response.json({ error: 'chzzk_name parameter is required' }, { status: 400 });
  }

  // 1. Look up user by display name (indexed column)
  const { data: user, error: userError } = await getSupabase()
    .from('users')
    .select('chzzk_channel_id')
    .eq('chzzk_channel_name', chzzkName)
    .single();

  if (userError || !user) {
    return Response.json({ entries: [] });
  }

  // 2. Fetch public tier_cache entries
  const { data, error } = await getSupabase()
    .from('tier_cache')
    .select('game_type, tier, rank, league_points, riot_game_name, riot_tag_line')
    .eq('chzzk_channel_id', user.chzzk_channel_id)
    .eq('is_public', true);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ entries: data });
}
