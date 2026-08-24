import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../data/languagesData';
import {
  Compass,
  QrCode,
  Shield,
  ShieldAlert,
  Sun,
  Moon,
  Globe,
  Bell,
  Search,
  User,
  Clock,
  Menu,
  X,
  Sparkles,
  MapPin
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const {
    currentPage,
    setCurrentPage,
    currentLanguage,
    setLanguageModalOpen,
    theme,
    toggleTheme,
    user,
    setSosModalOpen,
    setQrScannerOpen,
    setCheckInModalOpen,
    alerts
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('destination');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger (mobile/tablet) + SafarSetu Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-safar-navy-900 via-safar-navy-800 to-safar-teal-700 text-white shadow-md shadow-safar-navy-950/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-safar-saffron-400 group-hover:rotate-45 transition-transform duration-500" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-safar-navy-950 via-safar-navy-800 to-safar-saffron-600 dark:from-white dark:via-slate-100 dark:to-safar-saffron-400 bg-clip-text text-transparent">
                  SafarSetu
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-safar-saffron-500/10 text-safar-saffron-600 dark:text-safar-saffron-400 border border-safar-saffron-500/20">
                  सफ़र सेतु
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5">
                Digital Tourist Guide & Safety Platform
              </p>
            </div>
          </button>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Taj Mahal, Jaipur Forts, Safe Zones, Police..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700/80 focus:border-safar-saffron-500 focus:outline-none focus:ring-2 focus:ring-safar-saffron-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </form>
        </div>

        {/* Right: Actions (Language, Theme, Check-in, QR Scanner, Digital ID, SOS) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Language Selector */}
          <button
            onClick={() => setLanguageModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
            title="Change Language"
          >
            <span className="text-sm">{currentLangObj.flag}</span>
            <span className="hidden sm:inline">{currentLangObj.nativeName}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-700/60"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* QR Scanner Trigger */}
          <button
            onClick={() => setQrScannerOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition-all hover:scale-105"
            title="Scan Location QR Code"
          >
            <QrCode className="w-4 h-4 text-safar-teal-600 dark:text-safar-teal-400" />
            <span>Scan QR</span>
          </button>

          {/* Journey Check-in Pill */}
          <button
            onClick={() => setCheckInModalOpen(true)}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              user.checkInDueMinutes <= 15
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 animate-pulse'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            }`}
            title="Journey Check-In Status"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Check-in: {user.checkInDueMinutes}m</span>
          </button>

          {/* Digital ID Quick Button */}
          <button
            onClick={() => setCurrentPage('digital_id')}
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-safar-navy-900 to-safar-navy-800 hover:from-safar-navy-800 hover:to-safar-navy-700 border border-safar-navy-700/50 shadow-sm transition-all hover:scale-105"
          >
            <Shield className="w-4 h-4 text-safar-teal-400" />
            <span>Digital ID</span>
          </button>

          {/* EMERGENCY SOS BUTTON */}
          <button
            onClick={() => setSosModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black tracking-wider text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-md shadow-rose-600/30 border border-rose-500 transition-all uppercase pulse-ring-effect"
            title="Emergency SOS Dispatch"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
            <span>SOS</span>
          </button>

          {/* Profile link */}
          <button
            onClick={() => setCurrentPage('profile')}
            className="p-1 rounded-xl border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-safar-saffron-500/30 transition-all"
            title="My Profile"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-lg object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
