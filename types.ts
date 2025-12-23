export type ViewState = 'dashboard' | 'import' | 'bets' | 'reports' | 'analyst';

export enum MarketType {
  MATCH_ODDS = '1X2',
  DOUBLE_CHANCE = 'DC',
  OVER_UNDER = 'O/U',
  BTTS = 'BTTS', // Both Teams To Score
  HANDICAP = 'AH',
  OTHER = 'Other'
}

export enum BetStatus {
  PENDING = 'pending',
  WON = 'won',
  LOST = 'lost',
  VOID = 'void',
  CASHOUT = 'cashout'
}

export interface Bet {
  id: string;
  sport: string;
  league: string;
  match: string; // "Team A vs Team B"
  market: MarketType;
  selection: string;
  odds: number;
  stake: number;
  bookmaker?: string;
  status: BetStatus;
  profit?: number; // Null if pending
  date: string; // ISO string
  tags: string[];
}

export interface KPI {
  totalProfit: number;
  roi: number; // Return on Investment %
  yield: number; // Similar to ROI usually in betting contexts
  winRate: number; // %
  totalBets: number;
  avgOdds: number;
}

export interface BankrollSnapshot {
    date: string;
    balance: number;
}