// lib/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요.');
}

const SECRET: string = JWT_SECRET;

/**
 * 치지직 사용자 전용 JWT 생성
 * @param channelId 치지직 channel ID (sub로 사용)
 * @param channelName 치지직 채널명 (표시용)
 * @param expiresIn 만료 시간 (기본 '24h')
 * @returns JWT 문자열
 */
export function generateChzzkJwt(
  channelId: string,
  channelName: string,
  expiresIn: string = '24h'
): string {
  const payload = {
    sub: channelId,              // 고유 식별자 (RLS에서 사용)
    channel_name: channelName,   // 표시용 (선택)
    type: 'chzzk',               // 토큰 타입 구분 (RLS 정책에서 사용 가능)
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, SECRET, {
    expiresIn: expiresIn as any,
    algorithm: 'HS256',
  });
}

/**
 * Riot 사용자 전용 JWT 생성 (나중에 RSO 연동 시 사용)
 * @param puuid Riot PUUID
 * @param gameName Riot 게임 이름
 * @param tagLine 태그라인
 * @param expiresIn 만료 시간 (기본 '24h')
 * @returns JWT 문자열
 */
export function generateRiotJwt(
  puuid: string,
  gameName: string,
  tagLine: string,
  expiresIn: string = '24h'
): string {
  const payload = {
    sub: puuid,
    game_name: gameName,
    tag_line: tagLine,
    type: 'riot',
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, SECRET, {
    expiresIn: expiresIn as any,
    algorithm: 'HS256',
  });
}

/**
 * JWT 토큰 검증 및 디코드
 * @param token JWT 문자열
 * @returns 디코드된 payload
 * @throws Error 토큰 유효하지 않음
 */
export function verifyJwt(token: string): {
  sub: string;
  channel_name?: string;
  game_name?: string;
  tag_line?: string;
  type: 'chzzk' | 'riot';
  iat: number;
  exp: number;
} {
  try {
    return jwt.verify(token, SECRET) as any;
  } catch (err) {
    throw new Error('유효하지 않은 JWT 토큰입니다.');
  }
}

/**
 * 토큰 만료 여부 간단 체크 (필요 시 사용)
 * @param token JWT 문자열
 * @returns true: 유효, false: 만료 또는 유효하지 않음
 */
export function isJwtValid(token: string): boolean {
  try {
    const decoded = verifyJwt(token);
    return Date.now() < decoded.exp * 1000;
  } catch {
    return false;
  }
}
