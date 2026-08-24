import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  ShieldCheck,
  Compass,
  QrCode,
  Bot,
  ShieldAlert,
  ChevronRight,
  Clock
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user, setCurrentPage, setSosModalOpen } = useApp();

  const quickActions = [
    {
      title: 'Explore Nearby',
      desc: 'Top places and monuments around you',
      icon: Compass,
      page: 'destination' as const,
      color: 'text-[#12355B]',
    },
    {
      title: 'My Digital ID',
      desc: 'Access your verified tourist QR pass',
      icon: QrCode,
      page: 'digital_id' as const,
      color: 'text-[#168A72]',
    },
    {
      title: 'AI Assistant',
      desc: 'Ask travel questions & get quick advice',
      icon: Bot,
      page: 'assistant' as const,
      color: 'text-[#F28C28]',
    },
    {
      title: 'Emergency SOS',
      desc: 'Instant help and location sharing',
      icon: ShieldAlert,
      action: () => setSosModalOpen(true),
      color: 'text-[#DC2626]',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* 1. Greeting & Travel Overview Header */}
      <section className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#172033]">
          Good morning, {user.name.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-slate-500">
          Here is your travel overview and safety status.
        </p>
      </section>

      {/* 2. Current Location & Safety Status Banner */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Current Location Card */}
        <div className="safar-card p-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Current Location
          </span>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F28C28]" />
            <h2 className="text-lg font-bold text-[#172033]">
              {user.currentTrip.currentCity}, {user.currentTrip.state}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Trip: {user.currentTrip.title}
          </p>
        </div>

        {/* Safety Status Card */}
        <div className="safar-card p-5 space-y-2 bg-emerald-50/50 border-emerald-200">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Safety Status
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h2 className="text-lg font-bold text-emerald-900">
              🟢 You are in a Safe Zone
            </h2>
          </div>
          <p className="text-xs text-emerald-700">
            Active tourist police patrol & continuous monitoring in this sector.
          </p>
        </div>
      </section>

      {/* 3. Quick Actions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#172033]">Quick Actions</h2>
          <p className="text-xs text-slate-500">Essential shortcuts for your journey</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (action.action) {
                    action.action();
                  } else if (action.page) {
                    setCurrentPage(action.page);
                  }
                }}
                className="safar-card-hover p-5 text-left flex items-start gap-4 cursor-pointer"
              >
                <div className={`p-3 rounded-xl bg-slate-50 border border-slate-200 shrink-0 ${action.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <h3 className="font-bold text-sm text-[#172033] flex items-center justify-between">
                    <span>{action.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Journey Progress Overview */}
      <section className="safar-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#172033]">Journey Checkpoints</h3>
            <p className="text-xs text-slate-500">
              {user.currentTrip.visitedCount} of {user.currentTrip.totalCount} circuit stops visited
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('itinerary')}
            className="text-xs font-bold text-[#12355B] hover:underline"
          >
            View Full Journey →
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-[#12355B] w-[45%]" />
        </div>
      </section>

    </div>
  );
};
