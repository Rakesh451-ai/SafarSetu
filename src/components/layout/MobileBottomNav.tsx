import React from 'react';
import { useApp } from '../../context/AppContext';
import { Page } from '../../types';
import {
  LayoutDashboard,
  Compass,
  Map as MapIcon,
  Bot,
  ShieldAlert,
  Shield,
  CalendarDays
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, setSosModalOpen, isSosActive } = useApp();

  const navButtons = [
    { id: 'dashboard' as Page, label: 'Home', icon: LayoutDashboard },
    { id: 'destination' as Page, label: 'Explore', icon: Compass },
    { id: 'itinerary' as Page, label: 'Journey', icon: CalendarDays },
    { id: 'assistant' as Page, label: 'AI Copilot', icon: Bot },
    { id: 'map' as Page, label: 'Map', icon: MapIcon },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around relative">
        {navButtons.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-safar-saffron-600 dark:text-safar-saffron-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* Center Prominent Permanent SOS Button */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={() => setSosModalOpen(true)}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center text-white font-black text-[11px] shadow-lg transition-transform active:scale-90 border-4 border-white dark:border-slate-900 ${
              isSosActive
                ? 'bg-rose-600 animate-bounce ring-4 ring-rose-400'
                : 'bg-gradient-to-tr from-rose-700 via-rose-600 to-rose-500 hover:scale-105 shadow-rose-600/40'
            }`}
            title="Emergency SOS"
            aria-label="Emergency SOS"
          >
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <span className="leading-none mt-0.5 tracking-wider">SOS</span>
          </button>
        </div>

        {navButtons.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-safar-saffron-600 dark:text-safar-saffron-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
