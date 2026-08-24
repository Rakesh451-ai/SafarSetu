import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, X, Sparkles, Send, ArrowRight } from 'lucide-react';

export const FloatingAICopilot: React.FC = () => {
  const { currentPage, setCurrentPage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [miniQuery, setMiniQuery] = useState('');

  if (currentPage === 'assistant') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (miniQuery.trim()) {
      setCurrentPage('assistant');
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-40">
      {/* Mini Popup */}
      {isOpen && (
        <div className="mb-3 w-80 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-scale-in text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-safar-saffron-500 text-white flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">SafarSetu Copilot</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-slate-600 dark:text-slate-300">
            Need travel advice, safety check, or nearby spot recommendations?
          </p>

          <form onSubmit={handleSubmit} className="flex gap-1.5">
            <input
              type="text"
              value={miniQuery}
              onChange={(e) => setMiniQuery(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-safar-saffron-500"
            />
            <button
              type="submit"
              className="p-2 bg-safar-saffron-500 text-white rounded-xl hover:bg-safar-saffron-600 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <button
            onClick={() => {
              setCurrentPage('assistant');
              setIsOpen(false);
            }}
            className="w-full text-center text-[11px] font-bold text-safar-saffron-600 dark:text-safar-saffron-400 hover:underline pt-1 block"
          >
            Open Full AI Copilot Screen →
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-13 h-13 p-3.5 rounded-full bg-gradient-to-br from-safar-saffron-500 to-amber-500 text-white shadow-xl shadow-safar-saffron-500/30 border-2 border-white dark:border-slate-900 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center group"
        title="Chat with SafarSetu Copilot"
      >
        <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
