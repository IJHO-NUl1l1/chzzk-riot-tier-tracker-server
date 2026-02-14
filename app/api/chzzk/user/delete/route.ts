/**
 * Chzzk User Delete (Withdrawal)
 * DELETE /api/chzzk/user/delete
 * Body: { userId: string }
 * Revokes Chzzk token, then deletes tokens + user from DB
 */
import { NextRequest } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  const { userId } = await request.json();

  if (!userId) {
    return Response.json({ error: 'userId is required' }, { status: 400 });
  }

  const clientId = process.env.CHZZK_CLIENT_ID;
  const clientSecret = process.env.CHZZK_CLIENT_SECRET;

  // 1. Try to revoke Chzzk token if credentials exist
  if (clientId && clientSecret) {
    const { data: tokenRecord } = await getSupabase()
      .from('chzzk_tokens')
      .select('access_token')
      .eq('user_id', userId)
      .single();

    if (tokenRecord?.access_token) {
      await fetch('https://openapi.chzzk.naver.com/auth/v1/token/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          clientSecret,
          token: tokenRecord.access_token,
        }),
      }).catch(() => {}); // Best-effort revoke
    }
  }

  // 2. Delete tokens (chzzk_tokens, riot_tokens)
  await getSupabase().from('chzzk_tokens').delete().eq('user_id', userId);
  await getSupabase().from('riot_tokens').delete().eq('user_id', userId);
  await getSupabase().from('tier_cache').delete().eq('user_id', userId);

  // 3. Delete user
  const { error: deleteError } = await getSupabase()
    .from('users')
    .delete()
    .eq('id', userId);

  if (deleteError) {
    return Response.json({
      error: 'Failed to delete user',
      details: deleteError.message,
    }, { status: 500 });
  }

  return Response.json({ message: 'User deleted successfully' });
}
