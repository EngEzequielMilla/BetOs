import React from 'react';
import { Bet, BetStatus } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { MOCK_BANKROLL_START } from '../constants';

interface ReportsProps {
  bets: Bet[];
}

export const Reports: React.FC<ReportsProps> = ({ bets }) => {
  
  // Prepare data for Bankroll Trend
  const sortedBets = [...bets].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let runningBalance = MOCK_BANKROLL_START;
  const bankrollData = sortedBets.map(bet => {
      if (bet.status === BetStatus.WON || bet.status === BetStatus.LOST || bet.status === BetStatus.CASHOUT) {
          runningBalance += (bet.profit || 0);
      }
      return {
          date: new Date(bet.date).toLocaleDateString(),
          balance: runningBalance
      };
  });

  // Prepare data for Market Performance
  const marketStats: Record<string, { profit: number, count: number }> = {};
  bets.forEach(bet => {
      if (!marketStats[bet.market]) marketStats[bet.market] = { profit: 0, count: 0 };
      if (bet.status === BetStatus.WON || bet.status === BetStatus.LOST) {
          marketStats[bet.market].profit += (bet.profit || 0);
          marketStats[bet.market].count += 1;
      }
  });

  const marketData = Object.keys(marketStats).map(market => ({
      name: market,
      profit: parseFloat(marketStats[market].profit.toFixed(2)),
      count: marketStats[market].count
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Relatórios</h1>
        <p className="text-slate-400 mt-1">Análise visual de performance e evolução da banca.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bankroll Growth Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-6 pl-2 border-l-4 border-indigo-500">Crescimento da Banca</h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bankrollData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                            itemStyle={{ color: '#818cf8' }}
                        />
                        <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1' }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Profit by Market Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-6 pl-2 border-l-4 border-emerald-500">Lucro por Mercado</h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                        <Tooltip 
                            cursor={{fill: '#334155', opacity: 0.4}}
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} 
                        />
                        <Legend />
                        <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Lucro/Prejuízo (R$)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
      
      {/* Additional Stats Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Insights Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-4 rounded-lg">
                <p className="text-slate-500 text-sm">Melhor Mercado</p>
                <p className="text-xl font-bold text-white mt-1">
                    {marketData.sort((a,b) => b.profit - a.profit)[0]?.name || 'N/A'}
                </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg">
                <p className="text-slate-500 text-sm">Pior Mercado</p>
                <p className="text-xl font-bold text-white mt-1">
                    {marketData.sort((a,b) => a.profit - b.profit)[0]?.name || 'N/A'}
                </p>
            </div>
             <div className="bg-slate-950 p-4 rounded-lg">
                <p className="text-slate-500 text-sm">Volume Total</p>
                <p className="text-xl font-bold text-white mt-1">
                    {bets.length} Apostas
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};