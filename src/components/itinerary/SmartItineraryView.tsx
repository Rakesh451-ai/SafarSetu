import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  MapPin,
  Clock,
  Car,
  Footprints,
  Train,
  CheckCircle2,
  Plus,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SmartItineraryView: React.FC = () => {
  const { itinerary, optimizeItinerary, showToast, setCurrentPage } = useApp();
  const [activeDay, setActiveDay] = useState(1);

  const dayItems = itinerary.filter(item => item.day === activeDay).sort((a, b) => a.order - b.order);

  const handleOptimize = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    });
    optimizeItinerary();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033]">
            My Journey
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Delhi ➔ Agra ➔ Jaipur Heritage Circuit (3 Days)
          </p>
        </div>

        <button
          onClick={handleOptimize}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#168A72] hover:bg-[#137460] flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>Optimize Schedule</span>
        </button>
      </div>

      {/* Day Selector Buttons */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl max-w-fit">
        {[1, 2, 3].map((dayNum) => (
          <button
            key={dayNum}
            onClick={() => setActiveDay(dayNum)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeDay === dayNum
                ? 'bg-white text-[#12355B] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Day {dayNum}
          </button>
        ))}
      </div>

      {/* Clean Vertical Timeline */}
      <div className="safar-card p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="font-bold text-sm text-[#172033]">
            Day {activeDay} Schedule
          </span>
          <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Safe Routes
          </span>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {dayItems.map((item, idx) => (
            <div key={item.id} className="relative group">
              {/* Pin dot */}
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#12355B] border-2 border-white shadow-sm" />

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#12355B]">
                    {item.time}
                  </span>
                  <span className="text-slate-300">•</span>
                  <h3 className="font-bold text-sm text-[#172033]">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-500">
                  {item.location} • Recommended duration: {item.duration}
                </p>

                {item.travelTimeFromPrev && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-0.5">
                    <Car className="w-3 h-3 text-[#168A72]" />
                    <span>{item.travelTimeFromPrev} from previous stop ({item.distanceFromPrev})</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
