import React from 'react';
import { useApp } from '../../context/AppContext';
import { Page } from '../../types';
import {
  LayoutDashboard,
  Compass,
  Map as MapIcon,
  ShieldCheck,
  Bot,
  CalendarDays,
  ShieldAlert,
  Store,
  Download,
  Shield,
  Activity,
  User,
  PhoneCall,
  ChevronRight,
  Sparkles,
  Lock,
  Clock
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: Page;
  label: string;
  labelHi?: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  isEmergency?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage, user, alerts, t } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Explorer Dashboard', icon: LayoutDashboard },
    { id: 'destination', label: 'Destination Guides', icon: Compass, badge: 'Popular' },
    { id: 'map', label: 'Interactive Safety Map', icon: MapIcon, badge: 'Live GPS' },
    { id: 'digital_id', label: 'Digital Tourist ID', icon: ShieldCheck, badge: 'Verified', badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { id: 'assistant', label: 'SafarSetu AI Copilot', icon: Bot, badge: 'AI 2.0', badgeColor: 'bg-safar-saffron-500/10 text-safar-saffron-600 dark:text-safar-saffron-400' },
    { id: 'itinerary', label: 'Smart Itinerary', icon: CalendarDays },
    { id: 'safety', label: 'Live Safety Center', icon: ShieldAlert, badge: `${alerts.length} Alerts`, badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { id: 'checkin', label: 'Journey Safety Check-In', icon: Clock, badge: `${user.checkInDueMinutes}m` },
    { id: 'services', label: 'Verified Services', icon: Store, badge: 'Official' },
    { id: 'offline', label: 'Offline Travel Packs', icon: Download },
    { id: 'admin', label: 'Command Center', icon: Activity, badge: 'Admin', badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { id: 'profile', label: 'Profile & Emergency Contacts', icon: User },
  ];

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 sm:top-20 bottom-0 left-0 z-40 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Tourist Quick Status Card */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-safar-teal-500/30"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{user.name}</h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.id}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                  Status: Safe
                </span>
                <span className="text-[10px] text-slate-400">• {user.currentTrip.currentCity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Platform Features
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-safar-navy-900 to-safar-navy-800 text-white shadow-sm dark:from-slate-800 dark:to-slate-800/90 dark:text-safar-saffron-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-safar-saffron-400'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom: 24/7 Helpline Hotline Box */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/30">
          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-safar-navy-950 text-white text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1 text-safar-saffron-400">
                <PhoneCall className="w-3.5 h-3.5" /> 24x7 Tourist Helpline
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Toll Free
              </span>
            </div>
            <p className="text-[11px] text-slate-300">Dial 1363 / 112 for immediate multi-lingual tourist assistance.</p>
            <a
              href="tel:1363"
              className="block w-full text-center py-1.5 rounded-lg bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white font-bold text-xs transition-colors shadow-sm"
            >
              Call 1363 Tourist Police
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
