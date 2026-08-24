import React from 'react';
import { useApp } from '../../context/AppContext';
import { DESTINATIONS_DATA } from '../../data/destinationsData';
import {
  Compass,
  Star,
  MapPin,
  Clock,
  Headphones,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Users,
  Eye
} from 'lucide-react';

export const DestinationPreviewGrid: React.FC = () => {
  const { setCurrentPage, setSelectedDestinationId } = useApp();

  const handleSelect = (id: string) => {
    setSelectedDestinationId(id);
    setCurrentPage('destination');
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-safar-teal-500/10 text-safar-teal-600 dark:text-safar-teal-400 text-xs font-bold uppercase tracking-wider border border-safar-teal-500/20 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Top Circuits</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-950 dark:text-white tracking-tight">
              Featured Verified Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Real-time crowd meters, official audio guides, and verified safety protocols.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('destination')}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-safar-saffron-600 dark:text-safar-saffron-400 hover:underline"
          >
            <span>View All Destinations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid of Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS_DATA.slice(0, 3).map((dest) => {
            const getCrowdColor = () => {
              if (dest.crowdStatus === 'low') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
              if (dest.crowdStatus === 'moderate') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
              return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
            };

            return (
              <div
                key={dest.id}
                onClick={() => handleSelect(dest.id)}
                className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1.5"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/70 text-white backdrop-blur-md border border-white/20">
                      {dest.category}
                    </span>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${getCrowdColor()}`}>
                      Crowd: {dest.crowdStatus} ({dest.crowdPercentage}%)
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 inset-x-3 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-safar-saffron-400" />
                      <span>{dest.city}, {dest.state}</span>
                    </div>
                    <h3 className="font-display font-black text-xl text-white tracking-tight mt-0.5 group-hover:text-safar-saffron-400 transition-colors">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                      <span><strong>{dest.rating}</strong> ({dest.reviewsCount.toLocaleString()} reviews)</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 justify-end">
                      <Headphones className="w-4 h-4 text-safar-teal-500 shrink-0" />
                      <span>{dest.audioGuides.length} Audio Guides</span>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Entry Ticket</span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        ₹{dest.entryFee.domestic} <span className="text-[11px] font-normal text-slate-400">/ Indian</span>
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(dest.id);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-800 hover:bg-safar-saffron-500 hover:text-white text-white transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span>Explore Guide</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
