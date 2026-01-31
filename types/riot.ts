/**
 * Riot API related types
 */

// Riot Account data
export interface RiotAccountData {
    puuid: string;
    gameName: string;
    tagLine: string;
  }
  
  // Summoner data
  export interface SummonerData {
    id: string;
    accountId: string;
    puuid: string;
    name: string;
    profileIconId: number;
    revisionDate: number;
    summonerLevel: number;
  }
  
  // League entry data
  export interface LeagueEntryDTO {
    leagueId: string;
    summonerId: string;
    summonerName: string;
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
    hotStreak: boolean;
    veteran: boolean;
    freshBlood: boolean;
    inactive: boolean;
    miniSeries?: MiniSeriesDTO;
  }
  
  // Mini series data
  export interface MiniSeriesDTO {
    losses: number;
    progress: string;
    target: number;
    wins: number;
  }