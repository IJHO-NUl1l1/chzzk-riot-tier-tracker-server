/**
 * Chzzk OAuth - Revoke Token (Logout)
 * POST /api/chzzk/auth/revoke
 * Body: { userId: string }
 * Revokes token at Chzzk API and deletes from DB
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

  // 1. Get stored access token from DB
  const { data: tokenRecord, error: fetchError } = await getSupabase()
    .from('chzzk_tokens')
    .select('access_token')
    .eq('user_id', userId)
    .single();

  if (fetchError || !tokenRecord) {
    return Response.json({ error: 'No token found for user' }, { status: 404 });
  }

  // 2. Revoke token at Chzzk API
  const revokeResponse = await fetch('https://openapi.chzzk.naver.com/auth/v1/token/revoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId,
      clientSecret,
      accessToken: tokenRecord.access_token,
    }),
  });

  // Even if revoke fails at Chzzk, still delete from our DB
  const revokeData = await revokeResponse.json().catch(() => null);

  // 3. Delete token from DB
  const { error: deleteError } = await getSupabase()
    .from('chzzk_tokens')
    .delete()
    .eq('user_id', userId);

  if (deleteError) {
    return Response.json({
      error: 'Failed to delete token from DB',
      details: deleteError.message,
    }, { status: 500 });
  }

  return Response.json({
    message: 'Token revoked and deleted',
    chzzkRevoke: revokeResponse.ok ? 'success' : 'failed',
    chzzkRevokeStatus: revokeResponse.status,
    chzzkRevokeDetail: revokeData,
  });
}
