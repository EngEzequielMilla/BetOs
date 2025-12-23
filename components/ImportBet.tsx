import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, Save } from 'lucide-react';
import { Bet, BetStatus, MarketType } from '../types';
import { extractBetFromImage } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface ImportBetProps {
  onSave: (bet: Bet) => void;
}

export const ImportBet: React.FC<ImportBetProps> = ({ onSave }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Bet>>({
    status: BetStatus.PENDING,
    market: MarketType.MATCH_ODDS,
    date: new Date().toISOString().split('T')[0]
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      
      // Extract data
      setIsProcessing(true);
      setError(null);
      
      const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
      const extractedData = await extractBetFromImage(base64Data);
      
      setIsProcessing(false);
      
      if (extractedData) {
        setFormData(prev => ({
            ...prev,
            ...extractedData,
            // Ensure status is valid enum, default to pending if OCR fails there
            status: BetStatus.PENDING 
        }));
      } else {
        setError("Não foi possível ler o bilhete automaticamente. Por favor, preencha manualmente.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'odds' || name === 'stake' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.match || !formData.selection || !formData.odds || !formData.stake) {
        setError("Preencha os campos obrigatórios.");
        return;
    }

    const newBet: Bet = {
      id: uuidv4(),
      sport: formData.sport || 'Futebol',
      league: formData.league || 'Unknown',
      match: formData.match,
      market: formData.market as MarketType,
      selection: formData.selection,
      odds: formData.odds,
      stake: formData.stake,
      bookmaker: formData.bookmaker || 'Generic',
      status: formData.status as BetStatus,
      date: formData.date || new Date().toISOString(),
      tags: [],
      profit: (formData.status === BetStatus.WON) 
              ? (formData.stake * formData.odds) - formData.stake 
              : (formData.status === BetStatus.LOST ? -formData.stake : 0)
    };

    onSave(newBet);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div>
            <h1 className="text-3xl font-bold text-white">Importar Aposta</h1>
            <p className="text-slate-400 mt-1">Envie um print do seu bilhete ou preencha manualmente.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Upload Area */}
            <div className="space-y-4">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all h-80
                        ${imagePreview ? 'border-indigo-500 bg-slate-900' : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-900'}
                    `}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    
                    {isProcessing ? (
                        <div className="text-center">
                            <Loader2 className="animate-spin text-indigo-500 mx-auto mb-3" size={40} />
                            <p className="text-indigo-400 font-medium">Lendo print com IA...</p>
                        </div>
                    ) : imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="max-h-full object-contain rounded-lg" />
                    ) : (
                        <div className="text-center text-slate-500">
                            <Upload className="mx-auto mb-3 text-slate-600" size={40} />
                            <p className="font-medium text-slate-300">Clique para enviar print</p>
                            <p className="text-sm">JPG ou PNG</p>
                        </div>
                    )}
                </div>
                {error && (
                    <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                        <AlertCircle size={18} />
                        <span className="text-sm">{error}</span>
                    </div>
                )}
            </div>

            {/* Right: Form */}
            <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Esporte</label>
                        <input type="text" name="sport" value={formData.sport || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Liga</label>
                        <input type="text" name="league" value={formData.league || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Jogo (Home vs Away)</label>
                    <input type="text" name="match" value={formData.match || ''} onChange={handleChange} placeholder="Ex: Arsenal vs Chelsea" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Mercado</label>
                        <select name="market" value={formData.market} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                            {Object.values(MarketType).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Seleção</label>
                        <input type="text" name="selection" value={formData.selection || ''} onChange={handleChange} placeholder="Ex: Over 2.5" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Odd</label>
                        <input type="number" step="0.01" name="odds" value={formData.odds || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-yellow-400 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Stake (Valor)</label>
                        <input type="number" step="0.01" name="stake" value={formData.stake || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none" required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Casa</label>
                        <input type="text" name="bookmaker" value={formData.bookmaker || ''} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                         <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                            <option value={BetStatus.PENDING}>Pendente</option>
                            <option value={BetStatus.WON}>Green</option>
                            <option value={BetStatus.LOST}>Red</option>
                            <option value={BetStatus.VOID}>Anulada</option>
                            <option value={BetStatus.CASHOUT}>Cashout</option>
                        </select>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 mt-4"
                >
                    <Save size={20} />
                    <span>Confirmar e Salvar</span>
                </button>
            </form>
        </div>
    </div>
  );
};