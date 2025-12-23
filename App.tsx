import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, PlusCircle, LineChart, BrainCircuit, Wallet, Menu, Pencil, Check, X } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ImportBet } from './components/ImportBet';
import { BetList } from './components/BetList';
import { Reports } from './components/Reports';
import { AIAnalyst } from './components/AIAnalyst';
import { Bet, ViewState } from './types';
import { MOCK_BANKROLL_START } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [bets, setBets] = useState<Bet[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Bankroll State
  const [initialBankroll, setInitialBankroll] = useState(MOCK_BANKROLL_START);
  const [isEditingBankroll, setIsEditingBankroll] = useState(false);
  const [editBankrollValue, setEditBankrollValue] = useState(String(MOCK_BANKROLL_START));

  // Initial load - Empty to start fresh as requested
  useEffect(() => {
    setBets([]); 
  }, []);

  const handleSaveBet = (newBet: Bet) => {
    setBets(prev => [newBet, ...prev]);
    setCurrentView('bets');
  };

  const handleDeleteBet = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta aposta?')) {
        setBets(prev => prev.filter(bet => bet.id !== id));
    }
  };

  const currentBankroll = useMemo(() => {
    const profit = bets.reduce((acc, bet) => acc + (bet.profit || 0), 0);
    return initialBankroll + profit;
  }, [bets, initialBankroll]);

  const handleSaveBankroll = () => {
    const val = parseFloat(editBankrollValue);
    if (!isNaN(val)) {
        setInitialBankroll(val);
        setIsEditingBankroll(false);
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
        currentView === view
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white">B</span>
          </div>
          <span className="text-xl font-bold tracking-tight">BetOS</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 fixed md:relative z-50 h-full flex flex-col`}
      >
        <div className="p-6 hidden md:flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-white text-xl">B</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">BetOS</span>
        </div>

        <nav className="px-4 space-y-2 flex-1">
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="import" icon={PlusCircle} label="Importar Print" />
          <NavItem view="bets" icon={Wallet} label="Minhas Apostas" />
          <NavItem view="reports" icon={LineChart} label="Relatórios" />
          <NavItem view="analyst" icon={BrainCircuit} label="IA Analista" />
        </nav>

        {/* Bankroll Widget - Positioned after Nav items */}
        <div className="p-4 border-t border-slate-800 mt-4">
            <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-slate-300">Status da Banca</p>
                    {!isEditingBankroll && (
                        <button 
                            onClick={() => {
                                setEditBankrollValue(String(initialBankroll));
                                setIsEditingBankroll(true);
                            }}
                            className="text-slate-500 hover:text-indigo-400 transition-colors"
                            title="Ajustar Banca Inicial"
                        >
                            <Pencil size={12} />
                        </button>
                    )}
                </div>

                {isEditingBankroll ? (
                    <div className="space-y-2">
                         <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 mb-1">Banca Inicial:</span>
                            <input 
                                type="number" 
                                value={editBankrollValue}
                                onChange={(e) => setEditBankrollValue(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-indigo-500"
                                autoFocus
                            />
                         </div>
                         <div className="flex space-x-2">
                            <button 
                                onClick={handleSaveBankroll}
                                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-1 rounded flex items-center justify-center"
                            >
                                <Check size={14} />
                            </button>
                            <button 
                                onClick={() => setIsEditingBankroll(false)}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-1 rounded flex items-center justify-center"
                            >
                                <X size={14} />
                            </button>
                         </div>
                    </div>
                ) : (
                    <>
                         <div className="flex justify-between items-center mb-1">
                            <span>Inicial:</span>
                            <span className="text-slate-400">R$ {initialBankroll.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-700/50 pt-1 mt-1">
                            <span>Atual:</span>
                            <span className={`font-mono font-bold ${currentBankroll >= initialBankroll ? 'text-emerald-400' : 'text-rose-400'}`}>
                                R$ {currentBankroll.toFixed(2)}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen bg-slate-950">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {currentView === 'dashboard' && <Dashboard bets={bets} onViewChange={setCurrentView} />}
          {currentView === 'import' && <ImportBet onSave={handleSaveBet} />}
          {currentView === 'bets' && <BetList bets={bets} onDelete={handleDeleteBet} />}
          {currentView === 'reports' && <Reports bets={bets} />}
          {currentView === 'analyst' && <AIAnalyst bets={bets} />}
        </div>
      </main>
    </div>
  );
};

export default App;