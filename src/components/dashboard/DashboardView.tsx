import React from 'react';
import { useApp } from '../../context/AppContext';
import { DESTINATIONS_DATA } from '../../data/destinationsData';
import {
  LayoutDashboard,
  MapPin,
  Sun,
  CloudSun,
  ShieldCheck,
  ShieldAlert,
  Bot,
  QrCode,
  Compass,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Calendar,
  Sparkles,
  PhoneCall,
  ChevronRight,
  Navigation
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user, setCurrentPage, setSelectedDestinationId, setCheckInModalOpen, setQrScannerOpen, setSosModalOpen, alerts } = useApp();

  const currentDestination = DESTINATIONS_DATA.find(d => d.id === 'taj-mahal') || DESTINATIONS_DATA[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Greeting & Weather Strip */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-safar-navy-950 via-slate-900 to-safar-navy-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-safar-saffron-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Safe Tracking Active
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {user.id}</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
              Good morning, {user.name} 👋
            </h1>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300 flex-wrap">
              <span className="flex items-center gap-1.5 text-safar-saffron-400 font-semibold">
                <MapPin className="w-4 h-4" /> {user.currentTrip.currentCity}, {user.currentTrip.state}
              </span>
              <span>•</span>
              <span className="text-slate-400">Current Trip: <strong className="text-white">{user.currentTrip.title}</strong></span>
            </div>
          </div>

          {/* Weather & AQI Mini Widget */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-md shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sun className="w-7 h-7 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl text-white">29°C</span>
                <span className="text-xs text-slate-300 font-medium">Clear & Sunny</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span>AQI: <strong className="text-emerald-400">94 (Satisfactory)</strong></span>
                <span>•</span>
                <span>Humidity: 54%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* 1. MY JOURNEY (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-safar-teal-500/10 text-safar-teal-600 dark:text-safar-teal-400 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  My Journey Progress
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.currentTrip.visitedCount} of {user.currentTrip.totalCount} circuit checkpoints completed
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('itinerary')}
              className="text-xs font-bold text-safar-saffron-600 dark:text-safar-saffron-400 hover:underline flex items-center gap-1"
            >
              <span>Full Itinerary</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Route Completion: 45%</span>
              <span className="text-safar-teal-600 dark:text-safar-teal-400">5 Destinations Remaining</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-safar-teal-500 to-safar-saffron-500 w-[45%]" />
            </div>
          </div>

          {/* Current Stop & Upcoming Stop Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Current Active Spot */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-safar-navy-950 to-slate-900 text-white border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-safar-saffron-400">
                <span>Current Destination</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Checked-in</span>
              </div>
              <div>
                <h4 className="font-bold text-base text-white">{currentDestination.name}</h4>
                <p className="text-xs text-slate-300">{currentDestination.city} • Open until 06:30 PM</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-400">Crowd: Moderate (62%)</span>
                <button
                  onClick={() => {
                    setSelectedDestinationId(currentDestination.id);
                    setCurrentPage('destination');
                  }}
                  className="text-xs font-bold text-safar-saffron-400 hover:underline flex items-center gap-1"
                >
                  <span>Audio Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Next Stop */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span>Next Stop (Today 03:30 PM)</span>
                <span className="text-safar-teal-600 dark:text-safar-teal-400">2.5 km away</span>
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">Agra Fort & Diwan-i-Khas</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Agra, UP • Recommended duration: 2h</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-xs text-slate-500 dark:text-slate-400">Transport: 10m Cab</span>
                <button
                  onClick={() => setCurrentPage('map')}
                  className="text-xs font-bold text-safar-teal-600 dark:text-safar-teal-400 hover:underline flex items-center gap-1"
                >
                  <span>View Route</span>
                  <Navigation className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2. SAFETY STATUS & CHECK-IN (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Safety Status</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                🟢 Safe Zone
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Next Journey Check-In
              </span>
              <div className="font-display font-black text-3xl text-slate-900 dark:text-white">
                {user.checkInDueMinutes} <span className="text-sm font-medium text-slate-500">mins</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Contacts: <strong className="text-slate-700 dark:text-slate-300">{user.emergencyContacts[0]?.name}</strong>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setCheckInModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check In Now</span>
            </button>

            <button
              onClick={() => setCurrentPage('safety')}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors text-center"
            >
              Open Safety Center ({alerts.length} Alerts)
            </button>
          </div>
        </div>

        {/* 3. AI COPILOT LAUNCHER (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-safar-saffron-500/10 to-transparent dark:from-slate-900 dark:to-slate-900 border border-safar-saffron-500/30 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-safar-saffron-500 text-white flex items-center justify-center shadow-md shadow-safar-saffron-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  SafarSetu AI Travel Copilot
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  “Where would you like to explore today?”
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage('assistant')}
              className="px-3 py-1.5 rounded-xl bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white font-bold text-xs transition-colors shadow-sm"
            >
              Chat
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setCurrentPage('assistant')}
              className="p-3 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-safar-saffron-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-all group"
            >
              <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-safar-saffron-600 block">
                🍽️ Find safe lunch spots near Taj
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Hygienic verified restaurants</span>
            </button>

            <button
              onClick={() => setCurrentPage('assistant')}
              className="p-3 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-safar-saffron-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-all group"
            >
              <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-safar-saffron-600 block">
                🌅 Best sunset spot in Agra
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Mehtab Bagh river viewpoint</span>
            </button>
          </div>
        </div>

        {/* 4. DIGITAL ID WIDGET (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                My Digital Tourist ID
              </h3>
            </div>
            <div className="font-mono text-xs text-safar-teal-600 dark:text-safar-teal-400 font-bold">
              {user.id}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Verified by Ministry of Tourism. Scan at ASI turnstiles for paperless entry.
            </p>
            <div className="pt-1">
              <button
                onClick={() => setCurrentPage('digital_id')}
                className="text-xs font-bold text-safar-saffron-600 dark:text-safar-saffron-400 hover:underline flex items-center gap-1"
              >
                <span>View Full ID Card & QR</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div
            onClick={() => setCurrentPage('digital_id')}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shrink-0 cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={user.qrCodeUrl}
              alt="Digital ID QR"
              className="w-20 h-20 mx-auto"
            />
            <span className="text-[9px] font-bold text-slate-500 uppercase mt-1 block">Gate Pass</span>
          </div>
        </div>

      </div>

    </div>
  );
};
