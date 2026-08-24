import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Bot,
  Map as MapIcon,
  Store,
  QrCode,
  Sparkles,
  ArrowRight,
  Radio,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const FeaturePillars: React.FC = () => {
  const { setCurrentPage, setQrScannerOpen } = useApp();

  const features = [
    {
      id: 'digital_id',
      title: 'Digital Tourist ID Pass',
      tagline: 'Cryptographically Verified Identity',
      desc: 'Government & Police recognized digital ID pass with QR code, 256-bit encryption, instant emergency contact triggers, and offline travel card export.',
      icon: ShieldCheck,
      color: 'from-blue-600 to-indigo-700',
      actionLabel: 'View Digital Pass',
      badge: 'Govt Recognized',
      page: 'digital_id' as const,
    },
    {
      id: 'assistant',
      title: 'SafarSetu AI Copilot',
      tagline: 'Safety-Aware Intelligent Companion',
      desc: 'Smart 24/7 travel copilot that generates weather-safe, budget-optimized, wheelchair-accessible itineraries with real-time crowd alerts.',
      icon: Bot,
      color: 'from-amber-500 to-orange-600',
      actionLabel: 'Chat with Copilot',
      badge: 'AI 2.0 Engine',
      page: 'assistant' as const,
    },
    {
      id: 'map',
      title: 'Geofenced Safety Radar',
      tagline: 'Live GPS Telemetry & Risk Zones',
      desc: 'Interactive map displaying Safe 🟢, Caution 🟡, and Danger 🔴 geofenced perimeters with instant emergency route guidance and nearest police kiosks.',
      icon: MapIcon,
      color: 'from-teal-600 to-emerald-600',
      actionLabel: 'Open Safety Map',
      badge: 'Live Radar',
      page: 'map' as const,
    },
    {
      id: 'services',
      title: 'Verified Tourism Marketplace',
      tagline: 'Zero Hidden Charges & Verified Guides',
      desc: 'Book ASI-licensed tourist historians, verified boutique havelis, prepaid police-monitored electric cabs, and official monument fast-track passes.',
      icon: Store,
      color: 'from-emerald-600 to-teal-700',
      actionLabel: 'Explore Services',
      badge: '100% Transparent',
      page: 'services' as const,
    },
  ];

  return (
    <section className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-safar-saffron-500/10 text-safar-saffron-600 dark:text-safar-saffron-400 text-xs font-bold uppercase tracking-wider border border-safar-saffron-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Safety & Tourism Platform</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-950 dark:text-white tracking-tight">
            Designed for Trust, Intelligence & Seamless Exploration
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            A comprehensive ecosystem connecting tourists, verified local services, and civil emergency infrastructure.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setCurrentPage(item.page)}
                className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-950 dark:text-white group-hover:text-safar-saffron-600 dark:group-hover:text-safar-saffron-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold text-safar-teal-600 dark:text-safar-teal-400 mt-0.5 mb-2">
                    {item.tagline}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-safar-saffron-500">
                  <span>{item.actionLabel}</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Scan & Explore Callout Ribbon */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-safar-navy-950 via-slate-900 to-safar-navy-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-safar-saffron-500/20 border border-safar-saffron-500/30 text-safar-saffron-400 flex items-center justify-center shrink-0">
              <QrCode className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-safar-saffron-400 font-bold">
                CONTACTLESS HERITAGE ACCESS
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-white mt-0.5">
                Scan Location QR at Monuments for Instant Multi-lingual Audio Guides
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Every verified ASI heritage site and tourist booth features a SafarSetu verification QR. Scan to unlock transcripts, verified guides, and safe taxi booking.
              </p>
            </div>
          </div>

          <button
            onClick={() => setQrScannerOpen(true)}
            className="px-6 py-3 rounded-xl bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white font-bold text-xs sm:text-sm shrink-0 flex items-center gap-2 shadow-lg shadow-safar-saffron-500/30 transition-all hover:scale-105"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch QR Scanner</span>
          </button>
        </div>

      </div>
    </section>
  );
};
