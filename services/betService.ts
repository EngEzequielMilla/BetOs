import { Bet, BetStatus, KPI } from "../types";

export const calculateKPIs = (bets: Bet[]): KPI => {
  const finishedBets = bets.filter(b => b.status === BetStatus.WON || b.status === BetStatus.LOST);
  
  if (finishedBets.length === 0) {
    return {
      totalProfit: 0,
      roi: 0,
      yield: 0,
      winRate: 0,
      totalBets: 0,
      avgOdds: 0
    };
  }

  let totalStake = 0;
  let totalProfit = 0;
  let wins = 0;
  let oddsSum = 0;

  finishedBets.forEach(bet => {
    totalStake += bet.stake;
    totalProfit += (bet.profit || 0);
    if (bet.status === BetStatus.WON) wins++;
    oddsSum += bet.odds;
  });

  const roi = totalStake > 0 ? (totalProfit / totalStake) * 100 : 0;
  
  return {
    totalProfit,
    roi,
    yield: roi, // Using interchangeably for MVP
    winRate: (wins / finishedBets.length) * 100,
    totalBets: bets.length, // Total including pending
    avgOdds: oddsSum / finishedBets.length
  };
};

export const getStatusColor = (status: BetStatus): string => {
  switch (status) {
    case BetStatus.WON: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'; // Green
    case BetStatus.LOST: return 'bg-rose-500/20 text-rose-400 border-rose-500/50'; // Red
    case BetStatus.PENDING: return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
    case BetStatus.VOID: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    case BetStatus.CASHOUT: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    default: return 'bg-slate-700 text-slate-300';
  }
};

export const formatStatus = (status: BetStatus): string => {
    switch (status) {
        case BetStatus.WON: return 'Green';
        case BetStatus.LOST: return 'Red';
        case BetStatus.PENDING: return 'Pendente';
        case BetStatus.VOID: return 'Anulada';
        case BetStatus.CASHOUT: return 'Cashout';
        default: return status;
    }
};