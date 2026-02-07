/**
 * Riot RSO Logout Redirect
 * RSO 승인 후 로그아웃 로직 구현 예정
 */
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // TODO: RSO 승인 후 구현
  // 1. DB에서 유저 연동 정보 삭제
  // 2. 익스텐션으로 리다이렉트

  return Response.json({
    message: 'RSO logout endpoint - 구현 예정'
  });
}
