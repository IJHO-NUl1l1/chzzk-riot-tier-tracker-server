/**
 * Chzzk OAuth - Callback
 * Receives authorization code → exchanges for tokens → fetches user info → saves to DB
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // Validate required parameters
  if (!code || !state) {
    return Response.json({ error: 'Missing code or state parameter' }, { status: 400 });
  }

  const clientId = process.env.CHZZK_CLIENT_ID;
  const clientSecret = process.env.CHZZK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return Response.json({ error: 'Chzzk OAuth not configured' }, { status: 500 });
  }

  // Validate state against cookie (CSRF check)
  const cookieStore = await cookies();
  const storedState = cookieStore.get('chzzk_oauth_state')?.value;

  if (!storedState || storedState !== state) {
    return Response.json({ error: 'Invalid state parameter (CSRF check failed)' }, { status: 403 });
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch('https://openapi.chzzk.naver.com/auth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grantType: 'authorization_code',
        clientId,
        clientSecret,
        code,
        state,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return Response.json({
        error: 'Token exchange failed',
        details: tokenData,
      }, { status: tokenResponse.status });
    }

    const tokenContent = tokenData.content || tokenData;
    const { accessToken, refreshToken, expiresIn } = tokenContent;

    if (!accessToken || !refreshToken) {
      return Response.json({ error: 'Invalid token response from Chzzk', rawResponse: tokenData }, { status: 502 });
    }

    // 2. Fetch user info with access token
    const userResponse = await fetch('https://openapi.chzzk.naver.com/open/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok || !userData.content) {
      return Response.json({
        error: 'Failed to fetch Chzzk user info',
        details: userData,
      }, { status: 502 });
    }

    const { channelId, channelName } = userData.content;

    if (!channelId) {
      return Response.json({ error: 'Missing channelId in user info' }, { status: 502 });
    }

    // 3. UPSERT user in users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert(
        {
          chzzk_channel_id: channelId,
          chzzk_channel_name: channelName || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'chzzk_channel_id' }
      )
      .select('id')
      .single();

    if (userError || !user) {
      return Response.json({
        error: 'Failed to save user',
        details: userError?.message,
      }, { status: 500 });
    }

    // 4. UPSERT tokens in chzzk_tokens table
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    const { error: tokenError } = await supabase
      .from('chzzk_tokens')
      .upsert(
        {
          user_id: user.id,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (tokenError) {
      return Response.json({
        error: 'Failed to save tokens',
        details: tokenError.message,
      }, { status: 500 });
    }

    // 5. Clear cookies and redirect
    const redirectPath = cookieStore.get('chzzk_oauth_redirect')?.value || '/auth/success';
    const response = NextResponse.redirect(new URL(redirectPath, request.url));
    response.cookies.delete('chzzk_oauth_state');
    response.cookies.delete('chzzk_oauth_redirect');

    return response;
  } catch (error: any) {
    return Response.json({
      error: 'Chzzk OAuth callback failed',
      message: error.message,
    }, { status: 500 });
  }
}
