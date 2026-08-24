import React from 'react';
import { useApp } from '../../context/AppContext';
import { DESTINATIONS_DATA } from '../../data/destinationsData';
import {
  Compass,
  Bot,
  Shield,
  ShieldCheck,
  MapPin,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentPage, setSelectedDestinationId } = useApp();

  const featureCards = [
    {
      id: 'destination',
      title: 'Explore',
      icon: '🗺️',
      desc: 'Discover verified destinations, monuments, and nearby places.',
      page: 'destination' as const,
    },
    {
      id: 'assistant',
      title: 'AI Assistant',
      icon: '🤖',
      desc: 'Ask questions, plan your trip, and get smart recommendations.',
      page: 'assistant' as const,
    },
    {
      id: 'safety',
      title: 'Safety',
      icon: '🛡️',
      desc: 'Live safety status, hazard alerts, and emergency contacts.',
      page: 'safety' as const,
    },
    {
      id: 'digital_id',
      title: 'Digital ID',
      icon: '🪪',
      desc: 'Official verified tourist ID with QR code for quick check-ins.',
      page: 'digital_id' as const,
    },
  ];

  return (
    <div className="space-y-12 py-4">
      
      {/* 1. Clean Hero Section */}
      <section className="text-center max-w-2xl mx-auto py-8 sm:py-12 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172033] tracking-tight">
          Explore India. Travel Safely.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Your digital tourist guide for verified destinations, safety information, intelligent travel planning, and emergency assistance.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            onClick={() => setCurrentPage('destination')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white bg-[#12355B] hover:bg-[#0E2845] transition-colors shadow-sm"
          >
            Explore Destinations
          </button>

          <button
            onClick={() => setCurrentPage('digital_id')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 transition-colors"
          >
            Get Digital ID
          </button>
        </div>
      </section>

      {/* 2. Exactly 4 Simple Feature Cards */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((card) => (
            <button
              key={card.id}
              onClick={() => setCurrentPage(card.page)}
              className="safar-card-hover p-5 text-left flex flex-col justify-between space-y-3 cursor-pointer group"
            >
              <div>
                <span className="text-2xl block mb-2">{card.icon}</span>
                <h3 className="font-bold text-base text-[#172033] group-hover:text-[#12355B] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-2 text-xs font-semibold text-[#168A72] flex items-center gap-1">
                <span>Open {card.title}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Popular Destinations Section */}
      <section className="max-w-5xl mx-auto space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#172033]">Popular Destinations</h2>
            <p className="text-xs text-slate-500 mt-0.5">Top verified destinations with safety ratings</p>
          </div>
          <button
            onClick={() => setCurrentPage('destination')}
            className="text-xs font-bold text-[#12355B] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DESTINATIONS_DATA.slice(0, 3).map((dest) => (
            <div
              key={dest.id}
              onClick={() => {
                setSelectedDestinationId(dest.id);
                setCurrentPage('destination');
              }}
              className="safar-card-hover overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 px-2 py-0.5 rounded-md text-[11px] font-bold text-emerald-700 shadow-sm border border-emerald-100">
                    🟢 Safe
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#F28C28]" />
                    <span>{dest.city}, {dest.state}</span>
                  </div>
                  <h3 className="font-bold text-base text-[#172033] group-hover:text-[#12355B] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {dest.description}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Entry: ₹{dest.entryFee.domestic}
                </span>
                <span className="text-xs font-bold text-[#12355B] group-hover:underline flex items-center gap-1">
                  View Guide <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
