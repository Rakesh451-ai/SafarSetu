import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DESTINATIONS_DATA } from '../../data/destinationsData';
import { Destination } from '../../types';
import {
  Search,
  MapPin,
  Clock,
  Ticket,
  ShieldCheck,
  Headphones,
  Play,
  Pause,
  ArrowLeft,
  Navigation,
  Bookmark,
  CheckCircle2,
  XCircle,
  Volume2,
  ChevronRight
} from 'lucide-react';

export const DestinationGuideView: React.FC = () => {
  const { selectedDestinationId, setSelectedDestinationId, setCurrentPage, showToast } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0);

  // If a destination is selected, find it
  const selectedDest = DESTINATIONS_DATA.find(d => d.id === selectedDestinationId);

  // Filter destinations by search query
  const filteredDestinations = DESTINATIONS_DATA.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleSave = () => {
    setIsSaved(prev => !prev);
    showToast({
      title: !isSaved ? 'Destination Saved' : 'Removed from Saved',
      message: !isSaved ? `${selectedDest?.name} added to your saved places.` : `${selectedDest?.name} removed.`,
      type: 'info',
    });
  };

  const handleToggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
    if (!isPlayingAudio) {
      showToast({
        title: 'Audio Guide Started',
        message: `Playing audio narration for ${selectedDest?.name}.`,
        type: 'info',
      });
    }
  };

  /* =========================================================================
     VIEW 1: DETAILED DESTINATION VIEW (When a destination is selected)
     ========================================================================= */
  if (selectedDest) {
    const currentTrack = selectedDest.audioGuides[selectedLanguageIndex] || selectedDest.audioGuides[0];

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fade-in">
        
        {/* Back to all destinations button */}
        <button
          onClick={() => setSelectedDestinationId(null as any)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Destinations</span>
        </button>

        {/* 1. Header with Image */}
        <div className="space-y-4">
          <div className="relative aspect-[21/9] min-h-[240px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={selectedDest.image}
              alt={selectedDest.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 rounded-lg text-xs font-bold text-emerald-700 shadow-sm border border-emerald-100 flex items-center gap-1">
              <span>🟢 Safe Zone</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F28C28]" />
                <span>{selectedDest.city}, {selectedDest.state}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] mt-1">
                {selectedDest.name}
              </h1>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCurrentPage('map')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#12355B] hover:bg-[#0E2845] flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Start Navigation</span>
              </button>

              <button
                onClick={handleToggleSave}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                  isSaved
                    ? 'bg-orange-50 border-orange-200 text-[#F28C28]'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#F28C28]' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {selectedDest.description}
          </p>
        </div>

        {/* 2. Audio Guide Player (Simple & Clean) */}
        <section className="safar-card p-5 space-y-3 bg-slate-50 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#168A72]" />
              <h3 className="font-bold text-sm text-[#172033]">Audio Guide</h3>
              <span className="text-xs text-slate-500 font-mono">({currentTrack.duration})</span>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5">
              {selectedDest.audioGuides.map((guide, idx) => (
                <button
                  key={guide.id}
                  onClick={() => setSelectedLanguageIndex(idx)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedLanguageIndex === idx
                      ? 'bg-[#12355B] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {guide.language}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleToggleAudio}
              className="w-10 h-10 rounded-full bg-[#12355B] hover:bg-[#0E2845] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <div className="flex-1 space-y-1">
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-[#168A72] rounded-full" style={{ width: isPlayingAudio ? '45%' : '0%' }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>{isPlayingAudio ? '03:10' : '00:00'}</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic pt-1">
            {currentTrack.transcript.slice(0, 140)}...
          </p>
        </section>

        {/* 3. Key Details Grid: Opening Hours, Entry Fee, Best Time */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="safar-card p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Opening Hours</span>
            </div>
            <p className="font-bold text-sm text-[#172033]">{selectedDest.openingHours}</p>
          </div>

          <div className="safar-card p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase">
              <Ticket className="w-3.5 h-3.5 text-slate-500" />
              <span>Entry Fee</span>
            </div>
            <p className="font-bold text-sm text-[#172033]">
              ₹{selectedDest.entryFee.domestic} <span className="text-xs font-normal text-slate-500">(Indian)</span> / ₹{selectedDest.entryFee.international} <span className="text-xs font-normal text-slate-500">(Foreign)</span>
            </p>
          </div>

          <div className="safar-card p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Best Time to Visit</span>
            </div>
            <p className="font-bold text-sm text-[#172033]">{selectedDest.bestTimeToVisit}</p>
          </div>
        </section>

        {/* 4. Facilities & Accessibility */}
        <section className="safar-card p-5 space-y-3">
          <h3 className="font-bold text-sm text-[#172033]">Visitor Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {selectedDest.facilities.map((fac, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
              >
                ✓ {fac}
              </span>
            ))}
          </div>
        </section>

        {/* 5. Safety Guidelines (Dos & Don'ts) */}
        <section className="safar-card p-5 space-y-4">
          <h3 className="font-bold text-sm text-[#172033]">Safety Guidelines & Visitor Protocols</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Recommended (DOs)
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedDest.dosAndDonts.dos.map((doItem, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{doItem}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-red-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-600" /> Prohibited (DON'Ts)
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedDest.dosAndDonts.donts.map((dontItem, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{dontItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </div>
    );
  }

  /* =========================================================================
     VIEW 2: EXPLORE DESTINATIONS CATALOG (All Destinations List)
     ========================================================================= */
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fade-in">
      
      {/* Page Heading & Search */}
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033]">
            Explore Destinations
          </h1>
          <p className="text-sm text-slate-500">
            Discover verified monuments, heritage circuits, and attractions across India.
          </p>
        </div>

        {/* Clean Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places, monuments, cities (e.g. Taj Mahal, Jaipur, Agra)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#12355B]"
          />
        </div>
      </section>

      {/* Destinations List */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-[#172033]">
          Popular Destinations Near You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => setSelectedDestinationId(dest.id)}
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
