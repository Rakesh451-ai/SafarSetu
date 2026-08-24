import React from 'react';
import { useApp } from '../../context/AppContext';
import { Page } from '../../types';
import {
  Home,
  Compass,
  Calendar,
  Shield,
  User,
  ShieldAlert
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, setSosModalOpen } = useApp();

  const navItems = [
    { id: 'landing' as Page, label: 'Home', icon: Home },
    { id: 'destination' as Page, label: 'Explore', icon: Compass },
    { id: 'itinerary' as Page, label: 'Journey', icon: Calendar },
    { id: 'safety' as Page, label: 'Safety', icon: Shield },
    { id: 'profile' as Page, label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'landing' && currentPage === 'dashboard');
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'text-[#12355B] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#12355B]' : 'text-slate-400'}`} />
              <span className="text-[11px] mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
