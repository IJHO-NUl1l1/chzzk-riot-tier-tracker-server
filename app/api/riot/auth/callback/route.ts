/**
 * Riot RSO OAuth Callback
 * RSO 승인 후 토큰 교환 로직 구현 예정
 */
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // TODO: RSO 승인 후 구현
  // 1. code로 access_token 교환
  // 2. access_token으로 유저 정보 조회
  // 3. DB에 유저-랭크 매핑 저장
  // 4. 익스텐션으로 리다이렉트

  return Response.json({
    message: 'RSO callback endpoint - 구현 예정',
    code: code ? 'received' : 'missing',
    state: state ? 'received' : 'missing'
  });
}
