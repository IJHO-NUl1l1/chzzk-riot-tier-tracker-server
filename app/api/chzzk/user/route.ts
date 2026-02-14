/**
 * Chzzk User Lookup API
 * GET /api/chzzk/user?channelName=닉네임
 * Returns user info + token status from DB
 */
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const channelName = request.nextUrl.searchParams.get('channelName');

  if (!channelName) {
    return Response.json({ error: 'channelName parameter is required' }, { status: 400 });
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, chzzk_channel_id, chzzk_channel_name, riot_puuid, riot_game_name, riot_tag_line, riot_region, created_at, updated_at')
    .eq('chzzk_channel_name', channelName)
    .single();

  if (userError || !user) {
    return Response.json({ error: 'User not found', channelName }, { status: 404 });
  }

  // Check if tokens exist (don't expose actual token values)
  const { data: token } = await supabase
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
