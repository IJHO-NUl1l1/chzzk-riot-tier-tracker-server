/**
 * Authentication related types
 */

// OAuth token response from Riot API
export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    id_token?: string;
  }
  
  // Session data stored on server
  export interface SessionData {
    accessToken: string;
    refreshToken: string;
    expiresAt: number; // Timestamp when the token expires
    userId?: string;
    puuid?: string;
    region?: string;
  }
  
  // User info returned to client
  export interface UserInfo {
    puuid: string;
    gameName: string;
    tagLine: string;
    summonerId?: string;
    region?: string;
    accountId?: string;
  }
  
  // Auth state for CSRF protection
  export interface AuthState {
    state: string;
    createdAt: number;
  }