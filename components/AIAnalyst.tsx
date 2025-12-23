import React, { useState, useRef, useEffect } from 'react';
import { Bet } from '../types';
import { getAnalystInsights } from '../services/geminiService';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface AIAnalystProps {
  bets: Bet[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIAnalyst: React.FC<AIAnalystProps> = ({ bets }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Sou seu analista de apostas. Posso analisar seu ROI, identificar vazamentos de banca e sugerir ajustes na gestão. O que você gostaria de saber hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const responseText = await getAnalystInsights(bets, userMsg.content);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in">
        <div className="mb-4">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-indigo-400" />
                IA Analista
            </h1>
            <p className="text-slate-400 mt-1">Consultoria personalizada baseada nos seus dados.</p>
        </div>

        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-2xl">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                            {msg.role === 'assistant' ? <Bot size={20} className="text-white" /> : <User size={20} className="text-slate-200" />}
                        </div>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${
                            msg.role === 'assistant' 
                                ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' 
                                : 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20'
                        }`}>
                            <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                                {msg.content}
                            </div>
                            <div className="text-[10px] opacity-50 mt-2 text-right">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700">
                             <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-950 border-t border-slate-800">
                <form onSubmit={handleSendMessage} className="relative flex items-center max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Ex: Como melhorar meu ROI em apostas Over 2.5?"
                        className="w-full bg-slate-900 text-white placeholder-slate-500 border border-slate-700 rounded-full py-3.5 pl-6 pr-14 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputText.trim()}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </form>
                <p className="text-center text-xs text-slate-600 mt-2">
                    A IA pode cometer erros. Sempre verifique os dados e pratique jogo responsável.
                </p>
            </div>
        </div>
    </div>
  );
};