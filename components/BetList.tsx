import React, { useState } from 'react';
import { Bet, BetStatus, MarketType } from '../types';
import { getStatusColor, formatStatus } from '../services/betService';
import { Filter, Search, Trash2 } from 'lucide-react';

interface BetListProps {
  bets: Bet[];
  onDelete?: (id: string) => void;
}

export const BetList: React.FC<BetListProps> = ({ bets, onDelete }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBets = bets.filter(bet => {
    const matchesStatus = filterStatus === 'all' || bet.status === filterStatus;
    const matchesSearch = bet.match.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          bet.league.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bet.selection.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Minhas Apostas</h1>
          <p className="text-slate-400 mt-1">Histórico completo e detalhado.</p>
        </div>
        
        <div className="flex space-x-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar jogo, time..." 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="relative">
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-10 py-2 text-white appearance-none focus:outline-none focus:border-indigo-500"
                >
                    <option value="all">Todos Status</option>
                    <option value={BetStatus.WON}>Green</option>
                    <option value={BetStatus.LOST}>Red</option>
                    <option value={BetStatus.PENDING}>Pendente</option>
                    <option value={BetStatus.VOID}>Anulada</option>
                    <option value={BetStatus.CASHOUT}>Cashout</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4">Data</th>
                <th className="p-4">Esporte/Liga</th>
                <th className="p-4">Jogo</th>
                <th className="p-4">Mercado</th>
                <th className="p-4 text-right">Odd</th>
                <th className="p-4 text-right">Stake</th>
                <th className="p-4 text-right">Lucro</th>
                <th className="p-4 text-center">Status</th>
                {onDelete && <th className="p-4 text-center">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredBets.map(bet => (
                <tr key={bet.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4 text-slate-400 text-sm whitespace-nowrap">
                    {new Date(bet.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                     <div className="text-white font-medium">{bet.sport}</div>
                     <div className="text-xs text-slate-500">{bet.league}</div>
                  </td>
                  <td className="p-4 text-white font-medium">
                    {bet.match}
                  </td>
                  <td className="p-4">
                     <span className="text-slate-300 bg-slate-800 px-2 py-1 rounded text-xs">{bet.market}</span>
                     <div className="text-xs text-indigo-400 mt-1">{bet.selection}</div>
                  </td>
                  <td className="p-4 text-right font-mono text-yellow-400 font-bold">
                    {bet.odds.toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-mono text-slate-300">
                    {bet.stake.toFixed(2)}
                  </td>
                  <td className={`p-4 text-right font-mono font-bold ${(bet.profit || 0) > 0 ? 'text-emerald-400' : (bet.profit || 0) < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                    {bet.profit ? bet.profit.toFixed(2) : '-'}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(bet.status)}`}>
                      {formatStatus(bet.status)}
                    </span>
                  </td>
                  {onDelete && (
                      <td className="p-4 text-center">
                          <button 
                            onClick={() => onDelete(bet.id)}
                            className="text-slate-500 hover:text-rose-500 transition-colors p-2 hover:bg-rose-500/10 rounded-full"
                            title="Excluir aposta"
                          >
                              <Trash2 size={18} />
                          </button>
                      </td>
                  )}
                </tr>
              ))}
              {filteredBets.length === 0 && (
                 <tr>
                    <td colSpan={9} className="p-12 text-center text-slate-500">
                        Nenhuma aposta encontrada.
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