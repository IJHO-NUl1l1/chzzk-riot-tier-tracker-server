/**
 * Chzzk OAuth - Login redirect
 * Redirects user to Chzzk login page for account authorization
 */
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const clientId = process.env.CHZZK_CLIENT_ID;

  if (!clientId) {
    return Response.json({ error: 'Chzzk OAuth not configured' }, { status: 500 });
  }

  // Generate random state for CSRF protection
  const state = crypto.randomBytes(16).toString('hex');

  // Determine redirect URI based on environment
  const redirectUri = process.env.CHZZK_REDIRECT_URI
    || `${request.nextUrl.origin}/api/chzzk/auth/callback`;

  const authUrl = new URL('https://chzzk.naver.com/account-interlock');
  authUrl.searchParams.set('clientId', clientId);
  authUrl.searchParams.set('redirectUri', redirectUri);
  authUrl.searchParams.set('state', state);

  // Store state in cookie for CSRF validation in callback
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('chzzk_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  // Store optional post-login redirect path
  const redirectAfter = request.nextUrl.searchParams.get('redirect');
  if (redirectAfter) {
    response.cookies.set('chzzk_oauth_redirect', redirectAfter, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });
  }

  return response;
}
