import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Page } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/languagesData';
import {
  ShieldAlert,
  User as UserIcon,
  LogIn,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  QrCode,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    currentLanguage,
    setLanguageModalOpen,
    user,
    authUser,
    isAuthenticated,
    openAuthModal,
    logout,
    setSosModalOpen
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks: { id: Page; label: string }[] = [
    { id: 'landing', label: 'Home' },
    { id: 'destination', label: 'Explore' },
    { id: 'itinerary', label: 'My Journey' },
    { id: 'safety', label: 'Safety' },
    { id: 'digital_id', label: 'Digital ID' },
  ];

  const isAdmin = authUser?.role === 'ADMIN' || authUser?.is_staff;

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
          {isAdmin && (
            <button
              onClick={() => setCurrentPage('admin')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                currentPage === 'admin'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Command Center</span>
            </button>
          )}
        </nav>

        {/* Right: Language, Auth/Profile & SOS */}
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

          {/* User Auth Section */}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Account Menu"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[#12355B] text-white flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                    {user.name ? user.name.split(' ')[0] : 'Traveler'}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in text-xs">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{user.id || authUser?.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                        Admin Role
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => { setCurrentPage('profile'); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>Traveler Profile</span>
                  </button>

                  <button
                    onClick={() => { setCurrentPage('digital_id'); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-2"
                  >
                    <QrCode className="w-4 h-4 text-slate-400" />
                    <span>Digital Tourist Pass</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => { setCurrentPage('admin'); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-indigo-50 font-semibold text-indigo-700 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                      <span>Admin Command Center</span>
                    </button>
                  )}

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => { logout(); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 font-medium text-red-600 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#12355B] text-white hover:bg-[#0E2845] shadow-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

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

