/**
 * Chzzk OAuth - Refresh Token
 * POST /api/chzzk/auth/refresh
 * Body: { userId: string }
 * Uses stored refresh token to get new access + refresh tokens
 * Note: Chzzk refresh tokens are single-use (30 day expiry)
 */
import { NextRequest } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  if (!userId) {
    return Response.json({ error: 'userId is required' }, { status: 400 });
  }

  const clientId = process.env.CHZZK_CLIENT_ID;
  const clientSecret = process.env.CHZZK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return Response.json({ error: 'Chzzk OAuth not configured' }, { status: 500 });
  }

  // 1. Get stored refresh token from DB
  const { data: tokenRecord, error: fetchError } = await getSupabase()
    .from('chzzk_tokens')
    .select('refresh_token, expires_at')
    .eq('user_id', userId)
    .single();

  if (fetchError || !tokenRecord) {
    return Response.json({ error: 'No token found for user' }, { status: 404 });
  }

  // 2. Call Chzzk token endpoint with refresh_token grant
  const tokenResponse = await fetch('https://openapi.chzzk.naver.com/auth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grantType: 'refresh_token',
      clientId,
      clientSecret,
      refreshToken: tokenRecord.refresh_token,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    return Response.json({
      error: 'Token refresh failed',
      details: tokenData,
    }, { status: tokenResponse.status });
  }

  const tokenContent = tokenData.content || tokenData;
  const { accessToken, refreshToken, expiresIn } = tokenContent;

  if (!accessToken || !refreshToken) {
    return Response.json({
      error: 'Invalid refresh response from Chzzk',
      rawResponse: tokenData,
    }, { status: 502 });
  }

  // 3. Update tokens in DB (new access + new refresh, old refresh is now invalid)
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  const { error: updateError } = await getSupabase()
    .from('chzzk_tokens')
    .update({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (updateError) {
    return Response.json({
      error: 'Failed to update tokens',
      details: updateError.message,
    }, { status: 500 });
  }

  return Response.json({
    message: 'Token refreshed successfully',
    expiresAt,
  });
}
