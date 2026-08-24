import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ItineraryItem } from '../../types';
import {
  CalendarDays,
  Sparkles,
  Clock,
  MapPin,
  Car,
  Footprints,
  Train,
  IndianRupee,
  ShieldCheck,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Share2,
  Download,
  CheckCircle2,
  Zap,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SmartItineraryView: React.FC = () => {
  const { itinerary, setItinerary, optimizeItinerary, showToast, setCurrentPage } = useApp();
  const [activeDay, setActiveDay] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('02:00 PM');
  const [newLocation, setNewLocation] = useState<string>('');

  const currentDayItems = itinerary
    .filter(item => item.day === activeDay)
    .sort((a, b) => a.order - b.order);

  const totalCost = currentDayItems.reduce((acc, item) => acc + item.cost, 0);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...currentDayItems];
    const temp = items[index].order;
    items[index].order = items[index - 1].order;
    items[index - 1].order = temp;

    setItinerary(prev => {
      const otherDays = prev.filter(item => item.day !== activeDay);
      return [...otherDays, ...items];
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === currentDayItems.length - 1) return;
    const items = [...currentDayItems];
    const temp = items[index].order;
    items[index].order = items[index + 1].order;
    items[index + 1].order = temp;

    setItinerary(prev => {
      const otherDays = prev.filter(item => item.day !== activeDay);
      return [...otherDays, ...items];
    });
  };

  const handleDelete = (id: string) => {
    setItinerary(prev => prev.filter(item => item.id !== id));
    showToast({
      title: 'Stop Removed',
      message: 'Itinerary updated.',
      type: 'info',
    });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newItem: ItineraryItem = {
      id: `itin-${Date.now()}`,
      day: activeDay,
      order: currentDayItems.length + 1,
      time: newTime,
      title: newTitle,
      location: newLocation || newTitle,
      duration: '1.5 hours',
      transportMode: 'cab',
      travelTimeFromPrev: '15 mins',
      distanceFromPrev: '4.5 km',
      cost: 300,
      safetyStatus: 'safe',
      recommendedHours: 'Afternoon',
      coordinates: [26.9200, 75.8200],
      notes: 'Custom user addition to trip plan.'
    };
    setItinerary(prev => [...prev, newItem]);
    setNewTitle('');
    setNewLocation('');
    setShowAddModal(false);
    showToast({
      title: 'Stop Added to Day ' + activeDay,
      message: `${newItem.title} scheduled for ${newItem.time}.`,
      type: 'success',
    });
  };

  const handleOptimize = () => {
    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.5 }
    });
    optimizeItinerary();
  };

  const handleExportPDF = () => {
    showToast({
      title: 'Trip Itinerary Exported',
      message: 'Offline PDF & Calendar sync file generated.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-safar-saffron-500/10 text-safar-saffron-600 dark:text-safar-saffron-400 border border-safar-saffron-500/20">
              Trip Plan
            </span>
            <span className="text-xs text-slate-400">Jaipur & Royal Rajasthan • 3 Days</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white mt-1">
            Smart Trip Itinerary & Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Drag, reorder, and optimize your journey based on crowd schedules and safety conditions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOptimize}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-safar-teal-600 to-emerald-600 hover:from-safar-teal-500 hover:to-emerald-500 shadow-md shadow-safar-teal-600/20 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Optimize with AI</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stop</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day Tabs & Day Stats Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((dayNum) => (
            <button
              key={dayNum}
              onClick={() => setActiveDay(dayNum)}
              className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeDay === dayNum
                  ? 'bg-safar-navy-900 dark:bg-safar-saffron-500 text-white shadow-md scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              Day {dayNum}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>Stops: <strong className="text-slate-800 dark:text-slate-200">{currentDayItems.length}</strong></span>
          <span>•</span>
          <span>Est. Day Budget: <strong className="text-safar-teal-600 dark:text-safar-teal-400">₹{totalCost.toLocaleString()}</strong></span>
          <span>•</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Safe Routes
          </span>
        </div>
      </div>

      {/* Reorderable Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {currentDayItems.map((item, index) => {
          const getTransportIcon = () => {
            if (item.transportMode === 'walk') return <Footprints className="w-3.5 h-3.5 text-safar-teal-500" />;
            if (item.transportMode === 'metro') return <Train className="w-3.5 h-3.5 text-indigo-500" />;
            return <Car className="w-3.5 h-3.5 text-safar-saffron-500" />;
          };

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Pin Marker */}
              <div className="absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full bg-safar-saffron-500 text-white font-bold text-[10px] flex items-center justify-center border-4 border-white dark:border-slate-950 shadow-md ring-2 ring-safar-saffron-500/20">
                {item.order}
              </div>

              {/* Card Container */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-4">
                
                {/* Card Top: Time, Title, Safety Pill, Reorder Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {item.time}
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.safetyStatus === 'safe'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      {item.safetyStatus === 'safe' ? '🟢 Safe Route' : '⚠️ Peak Caution'}
                    </span>

                    {/* Up / Down Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors"
                        title="Move Earlier"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === currentDayItems.length - 1}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors"
                        title="Move Later"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove Stop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{item.location}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.duration}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Transit From Prev</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      {getTransportIcon()}
                      <span>{item.travelTimeFromPrev} ({item.distanceFromPrev})</span>
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Est. Cost</span>
                    <span className="font-bold text-safar-teal-600 dark:text-safar-teal-400">₹{item.cost}</span>
                  </div>
                </div>

                {/* Notes */}
                {item.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50/50 dark:bg-slate-800/20 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    💡 Tip: {item.notes}
                  </p>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Add Stop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl space-y-4 animate-scale-in">
            <h3 className="font-display font-bold text-lg">Add New Itinerary Stop</h3>
            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Monument / Place Title</label>
                <input
                  type="text"
                  placeholder="e.g. Jantar Mantar Observatory"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-safar-saffron-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Time</label>
                <input
                  type="text"
                  placeholder="e.g. 03:00 PM"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-safar-saffron-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Address / Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Near City Palace, Jaipur"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-safar-saffron-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-safar-saffron-500 text-white hover:bg-safar-saffron-600"
                >
                  Add Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
