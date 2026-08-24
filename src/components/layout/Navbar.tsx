import React from 'react';
import { useApp } from '../../context/AppContext';
import { Page } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/languagesData';
import {
  Compass,
  Shield,
  ShieldAlert,
  Globe,
  User,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    currentLanguage,
    setLanguageModalOpen,
    user,
    setSosModalOpen
  } = useApp();

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const navLinks: { id: Page; label: string }[] = [
    { id: 'landing', label: 'Home' },
    { id: 'destination', label: 'Explore' },
    { id: 'itinerary', label: 'My Journey' },
    { id: 'safety', label: 'Safety' },
    { id: 'digital_id', label: 'Digital ID' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <button
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#12355B] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <span className="text-[#F28C28]">स</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-lg text-[#12355B] tracking-tight">SafarSetu</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-50 text-[#F28C28] border border-orange-200">
                सफ़र सेतु
              </span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:block">Digital Tourist Guide</span>
          </div>
        </button>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id || (link.id === 'landing' && currentPage === 'dashboard');
            return (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-[#12355B] font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Language, Profile & SOS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <button
            onClick={() => setLanguageModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Change Language"
          >
            <span>{currentLang.flag}</span>
            <span className="hidden sm:inline">{currentLang.nativeName}</span>
          </button>

          {/* User Profile / Dashboard Link */}
          <button
            onClick={() => setCurrentPage('profile')}
            className={`p-1.5 rounded-lg border transition-colors ${
              currentPage === 'profile'
                ? 'border-[#12355B] bg-slate-100'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
            title="Profile & Settings"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={() => setSosModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#DC2626] hover:bg-red-700 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
            title="Emergency SOS"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>
        </div>

      </div>
    </header>
  );
};
