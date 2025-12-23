import React, { useMemo } from 'react';
import { Bet, ViewState } from '../types';
import { calculateKPIs, getStatusColor, formatStatus } from '../services/betService';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Percent, Target } from 'lucide-react';

interface DashboardProps {
  bets: Bet[];
  onViewChange: (view: ViewState) => void;
}

const KPICard = ({ title, value, icon: Icon, trend, subLabel }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors duration-200">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${trend === 'positive' ? 'text-emerald-400' : trend === 'negative' ? 'text-rose-400' : 'text-white'}`}>
          {value}
        </h3>
      </div>
      <div className="p-2 bg-slate-800 rounded-lg text-indigo-400">
        <Icon size={20} />
      </div>
    </div>
    {subLabel && <p className="text-xs text-slate-500">{subLabel}</p>}
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ bets, onViewChange }) => {
  const kpi = useMemo(() => calculateKPIs(bets), [bets]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Visão geral da sua performance.</p>
        </div>
        <button 
            onClick={() => onViewChange('import')}
            className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center space-x-2"
        >
            <span>+ Nova Aposta</span>
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Lucro Total (P&L)" 
          value={`R$ ${kpi.totalProfit.toFixed(2)}`} 
          icon={DollarSign}
          trend={kpi.totalProfit >= 0 ? 'positive' : 'negative'}
        />
        <KPICard 
          title="ROI" 
          value={`${kpi.roi.toFixed(1)}%`} 
          icon={Activity}
          trend={kpi.roi > 0 ? 'positive' : kpi.roi < 0 ? 'negative' : 'neutral'}
          subLabel="Retorno sobre investimento"
        />
        <KPICard 
          title="Taxa de Acerto" 
          value={`${kpi.winRate.toFixed(1)}%`} 
          icon={Target}
          subLabel={`${kpi.totalBets} apostas totais`}
        />
        <KPICard 
          title="Odd Média" 
          value={kpi.avgOdds.toFixed(2)} 
          icon={Percent}
          subLabel="Em apostas finalizadas"
        />
      </div>

      {/* Recent Bets */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Apostas Recentes</h2>
          <button onClick={() => onViewChange('bets')} className="text-sm text-indigo-400 hover:text-indigo-300">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4">Data</th>
                <th className="p-4">Jogo</th>
                <th className="p-4">Seleção</th>
                <th className="p-4">Odd</th>
                <th className="p-4">Stake</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {bets.slice(0, 5).map(bet => (
                <tr key={bet.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-400 text-sm">
                    {new Date(bet.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white">{bet.match}</div>
                    <div className="text-xs text-slate-500">{bet.league}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                    {bet.selection} <span className="text-slate-500">({bet.market})</span>
                  </td>
                  <td className="p-4 font-mono text-yellow-400">{bet.odds.toFixed(2)}</td>
                  <td className="p-4 font-mono text-slate-300">R$ {bet.stake}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(bet.status)}`}>
                      {formatStatus(bet.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {bets.length === 0 && (
                 <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                        Nenhuma aposta registrada ainda.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};