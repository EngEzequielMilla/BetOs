import { Bet, BetStatus, MarketType } from "./types";

export const MOCK_BANKROLL_START = 2000;

export const SEED_BETS: Bet[] = [
  {
    id: '1',
    sport: 'Futebol',
    league: 'Premier League',
    match: 'Arsenal vs Liverpool',
    market: MarketType.MATCH_ODDS,
    selection: 'Arsenal',
    odds: 2.45,
    stake: 100,
    bookmaker: 'Bet365',
    status: BetStatus.WON,
    profit: 145,
    date: '2023-10-25T14:00:00Z',
    tags: ['big-game', 'home-favorite']
  },
  {
    id: '2',
    sport: 'Futebol',
    league: 'La Liga',
    match: 'Real Madrid vs Barcelona',
    market: MarketType.BTTS,
    selection: 'Sim',
    odds: 1.65,
    stake: 200,
    bookmaker: 'Betano',
    status: BetStatus.LOST,
    profit: -200,
    date: '2023-10-26T18:00:00Z',
    tags: ['el-clasico']
  },
  {
    id: '3',
    sport: 'Basquete',
    league: 'NBA',
    match: 'Lakers vs Warriors',
    market: MarketType.HANDICAP,
    selection: 'Lakers -5.5',
    odds: 1.90,
    stake: 150,
    bookmaker: 'Pinnacle',
    status: BetStatus.WON,
    profit: 135,
    date: '2023-10-27T22:00:00Z',
    tags: ['nba-night']
  },
  {
    id: '4',
    sport: 'Futebol',
    league: 'Brasileirão',
    match: 'Flamengo vs Palmeiras',
    market: MarketType.OVER_UNDER,
    selection: 'Over 2.5',
    odds: 2.10,
    stake: 100,
    bookmaker: 'Bet365',
    status: BetStatus.PENDING,
    profit: 0,
    date: new Date().toISOString(), // Today
    tags: ['brasil']
  },
  {
    id: '5',
    sport: 'Tênis',
    league: 'Roland Garros',
    match: 'Alcaraz vs Djokovic',
    market: MarketType.MATCH_ODDS,
    selection: 'Djokovic',
    odds: 2.80,
    stake: 50,
    bookmaker: 'Betfair',
    status: BetStatus.LOST,
    profit: -50,
    date: '2023-10-20T10:00:00Z',
    tags: ['grand-slam', 'high-risk']
  }
];