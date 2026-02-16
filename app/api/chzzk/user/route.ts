/**
 * Chzzk User API
 * GET /api/chzzk/user?channelName=닉네임 — Returns user info + token status
 * PATCH /api/chzzk/user — Updates riot account fields for a user
 */
import { NextRequest } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const channelName = request.nextUrl.searchParams.get('channelName');

  if (!channelName) {
    return Response.json({ error: 'channelName parameter is required' }, { status: 400 });
  }

  const { data: user, error: userError } = await getSupabase()
    .from('users')
    .select('id, chzzk_channel_id, chzzk_channel_name, riot_puuid, riot_game_name, riot_tag_line, riot_region, created_at, updated_at')
    .eq('chzzk_channel_name', channelName)
    .single();

  if (userError || !user) {
    return Response.json({ error: 'User not found', channelName }, { status: 404 });
  }

  // Check if tokens exist (don't expose actual token values)
  const { data: token } = await getSupabase()
    .from('chzzk_tokens')
    .select('expires_at, updated_at')
    .eq('user_id', user.id)
    .single();

  const tokenStatus = token
    ? {
        hasToken: true,
        expiresAt: token.expires_at,
        isExpired: new Date(token.expires_at) < new Date(),
        lastUpdated: token.updated_at,
      }
    : { hasToken: false };

  return Response.json({
    user,
    chzzkToken: tokenStatus,
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, riotPuuid, riotGameName, riotTagLine, riotRegion } = body;

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    const updateData: Record<string, string | null> = {
      riot_puuid: riotPuuid ?? null,
      riot_game_name: riotGameName ?? null,
      riot_tag_line: riotTagLine ?? null,
      riot_region: riotRegion ?? null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await getSupabase()
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, riot_puuid, riot_game_name, riot_tag_line, riot_region')
      .single();

    if (error || !data) {
      return Response.json({
        error: 'Failed to update user',
        details: error?.message,
      }, { status: 500 });
    }

    return Response.json({ user: data });
  } catch (error: any) {
    return Response.json({
      error: 'Invalid request body',
      message: error.message,
    }, { status: 400 });
  }
}
