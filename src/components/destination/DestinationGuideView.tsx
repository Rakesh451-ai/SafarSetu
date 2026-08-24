import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DESTINATIONS_DATA } from '../../data/destinationsData';
import {
  Compass,
  MapPin,
  Star,
  Clock,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  QrCode,
  ShieldCheck,
  ShieldAlert,
  Sun,
  Wind,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Users,
  Video,
  Languages,
  Share2,
  Ticket,
  ChevronRight
} from 'lucide-react';

export const DestinationGuideView: React.FC = () => {
  const { selectedDestinationId, setSelectedDestinationId, setQrScannerOpen, setCurrentPage, showToast } = useApp();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'audio' | 'safety' | 'facilities' | 'reviews'>('overview');
  const [selectedAudioTrackIndex, setSelectedAudioTrackIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [audioProgress, setAudioProgress] = useState<number>(35); // 35%
  const [showPanoramaModal, setShowPanoramaModal] = useState<boolean>(false);

  const destination = DESTINATIONS_DATA.find(d => d.id === selectedDestinationId) || DESTINATIONS_DATA[0];
  const currentTrack = destination.audioGuides[selectedAudioTrackIndex] || destination.audioGuides[0];

  const handleToggleAudio = () => {
    setIsPlayingAudio(prev => !prev);
    if (!isPlayingAudio) {
      showToast({
        title: 'Audio Guide Playing',
        message: `Narrating "${currentTrack.title}" in ${currentTrack.language}.`,
        type: 'info',
      });
    }
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 0.75];
    const nextIdx = (speeds.indexOf(audioSpeed) + 1) % speeds.length;
    setAudioSpeed(speeds[nextIdx]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Destination Switcher Carousel Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DESTINATIONS_DATA.map((dest) => {
          const isSelected = dest.id === destination.id;
          return (
            <button
              key={dest.id}
              onClick={() => {
                setSelectedDestinationId(dest.id);
                setSelectedAudioTrackIndex(0);
                setIsPlayingAudio(false);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-safar-navy-950 to-safar-navy-800 text-white shadow-md shadow-safar-navy-950/20 ring-2 ring-safar-saffron-500/40 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{dest.name}</span>
              <span className="text-[10px] opacity-75">({dest.city})</span>
            </button>
          );
        })}
      </div>

      {/* Hero Panoramic Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-[21/9] min-h-[300px]">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-950/70 text-white backdrop-blur-md border border-white/20">
              UNESCO Heritage
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Safety Score: {destination.safetyRating}/5
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPanoramaModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>360° View</span>
            </button>
            <button
              onClick={() => setQrScannerOpen(true)}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
              title="Scan Monument QR"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Hero Content */}
        <div className="absolute bottom-6 inset-x-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-safar-saffron-400 font-semibold mb-1">
              <MapPin className="w-4 h-4" />
              <span>{destination.city}, {destination.state}</span>
              <span>•</span>
              <span>{destination.openingHours}</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
              {destination.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 line-clamp-1">
              {destination.tagline}
            </p>
          </div>

          {/* Crowd & Weather Pill */}
          <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 shrink-0">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Live Crowd</div>
              <div className="font-bold text-xs text-amber-400 capitalize">{destination.crowdStatus} ({destination.crowdPercentage}%)</div>
            </div>
            <div className="h-7 w-px bg-slate-700" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400">Weather</div>
              <div className="font-bold text-xs text-white">{destination.weather.temp}°C {destination.weather.condition}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm font-bold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'history', label: 'History & Architecture' },
            { id: 'audio', label: `Audio Guide (${destination.audioGuides.length})` },
            { id: 'safety', label: 'Safety & Guidelines' },
            { id: 'facilities', label: 'Facilities & Access' },
            { id: 'reviews', label: `Reviews (${destination.reviewsCount.toLocaleString()})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-safar-navy-900 text-white dark:bg-safar-saffron-500 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                About the Monument
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {destination.description}
              </p>

              {/* Fast Facts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Best Time</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{destination.bestTimeToVisit}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Visiting Hours</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{destination.openingHours}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Air Quality (AQI)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{destination.weather.aqi} • {destination.weather.aqiStatus}</span>
                </div>
              </div>
            </div>

            {/* Nearby Verified Attractions */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Nearby Verified Attractions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {destination.nearbyAttractions.map((att, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 group">
                    <img src={att.image} alt={att.name} className="w-full h-24 object-cover group-hover:scale-105 transition-transform" />
                    <div className="p-3">
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{att.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{att.distance} away</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 4 cols: Ticket Breakdown & Audio Guide Widget */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Ticket Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-safar-saffron-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Official Entry Ticket</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                  ASI Standard
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-600 dark:text-slate-400">Indian National:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{destination.entryFee.domestic}</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-600 dark:text-slate-400">Foreign National:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{destination.entryFee.international}</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-slate-600 dark:text-slate-400">Video Camera Fee:</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{destination.entryFee.camera}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentPage('services');
                  showToast({
                    title: 'Redirecting to Official Fast-Pass Booking',
                    message: `Official skip-the-line e-ticket for ${destination.name}.`,
                    type: 'info',
                  });
                }}
                className="w-full py-3 rounded-xl bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Fast-Track Digital Pass</span>
              </button>
            </div>

            {/* Mini Audio Guide Widget */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-safar-navy-950 text-white border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-safar-teal-400" />
                  <h4 className="font-bold text-sm text-white">Audio Guide</h4>
                </div>
                <span className="text-xs text-safar-saffron-400 font-mono">{currentTrack.duration}</span>
              </div>

              <div>
                <div className="font-semibold text-xs text-white">{currentTrack.title}</div>
                <div className="text-[11px] text-slate-400">{currentTrack.language}</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleAudio}
                  className="w-10 h-10 rounded-full bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="flex-1 space-y-1">
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-safar-teal-400 rounded-full" style={{ width: `${audioProgress}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>04:12</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('audio')}
                className="w-full py-2 text-center text-xs font-semibold text-safar-teal-300 hover:underline"
              >
                Open Full Audio Guide & Transcripts →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: HISTORY */}
      {activeTab === 'history' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-safar-saffron-500/10 text-safar-saffron-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                Historical Chronicle & Architectural Marvel
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified by Archaeological Survey of India (ASI)</p>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
            {destination.history}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Architectural Highlights</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pietra Dura semi-precious stone inlays (jasper, jade, turquoise, lapis lazuli), self-supporting outer minarets engineered to tilt slightly outward for earthquake resilience, and symmetrical Charbagh gardens representing paradise.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Conservation & UNESCO Status</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Designated as a UNESCO World Heritage site in 1983. Strict Taj Trapezium Zone (TTZ) emission rules protect the pristine white Makrana marble from environmental degradation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIO GUIDE PLAYER */}
      {activeTab === 'audio' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                Multilingual Audio Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official voice narration curated by certified historians
              </p>
            </div>

            {/* Language Track Selector */}
            <div className="flex items-center gap-2">
              {destination.audioGuides.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setSelectedAudioTrackIndex(idx);
                    setIsPlayingAudio(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedAudioTrackIndex === idx
                      ? 'bg-safar-saffron-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {track.language}
                </button>
              ))}
            </div>
          </div>

          {/* Main Player Component */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-safar-navy-950 text-white space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-safar-saffron-400">NOW PLAYING</span>
                <h4 className="font-display font-bold text-lg text-white mt-0.5">{currentTrack.title}</h4>
              </div>
              <button
                onClick={handleSpeedChange}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-safar-teal-400 font-mono text-xs font-bold border border-slate-700"
              >
                {audioSpeed}x Speed
              </button>
            </div>

            {/* Scrubber Progress */}
            <div className="space-y-1.5">
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                  setAudioProgress(pct);
                }}
                className="w-full h-3 rounded-full bg-slate-800 overflow-hidden cursor-pointer relative"
              >
                <div className="h-full bg-gradient-to-r from-safar-teal-400 to-safar-saffron-400 rounded-full" style={{ width: `${audioProgress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>04:12</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setAudioProgress(Math.max(0, audioProgress - 10))}
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Rewind 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleAudio}
                className="w-14 h-14 rounded-full bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white flex items-center justify-center shadow-lg shadow-safar-saffron-500/30 transition-transform active:scale-95"
              >
                {isPlayingAudio ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <button
                onClick={() => setAudioProgress(Math.min(100, audioProgress + 10))}
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Forward 10s"
              >
                <RotateCcw className="w-4 h-4 -scale-x-100" />
              </button>
            </div>
          </div>

          {/* Transcript Box */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Audio Transcript</h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {currentTrack.transcript}
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: SAFETY & DOS AND DONTS */}
      {activeTab === 'safety' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                Official Safety Guidelines & Monument Protocols
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Issued by UP Tourist Police & ASI Administration</p>
            </div>
          </div>

          {/* Safety rules list */}
          <div className="space-y-2.5">
            {destination.safetyGuidelines.map((guide, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-safar-teal-500 shrink-0 mt-0.5" />
                <span>{guide}</span>
              </div>
            ))}
          </div>

          {/* Dos & Don'ts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* DOs */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-3">
              <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Recommended (DOs)
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {destination.dosAndDonts.dos.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DONTs */}
            <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-500/20 space-y-3">
              <h4 className="font-bold text-sm text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Prohibited (DON'Ts)
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {destination.dosAndDonts.donts.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FACILITIES & ACCESSIBILITY */}
      {activeTab === 'facilities' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
              Accessibility & Visitor Facilities
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Universal access amenities at {destination.name}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {destination.facilities.map((fac, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{fac}</span>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-safar-teal-50/50 dark:bg-safar-teal-950/20 border border-safar-teal-500/20 space-y-2 text-xs">
            <h4 className="font-bold text-safar-teal-800 dark:text-safar-teal-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Assisted Wheelchair & Special Needs Services
            </h4>
            <p className="text-slate-600 dark:text-slate-300">
              Complimentary wheelchairs and dedicated assistance volunteers are stationed at both East Gate and West Gate ticketing complexes. Battery-operated golf carts operate continuously.
            </p>
          </div>
        </div>
      )}

      {/* TAB 6: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                Verified Traveler Reviews
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified reviews from authenticated Digital Tourist ID pass holders
              </p>
            </div>
            <div className="flex items-center gap-1.5 font-display font-bold text-lg text-slate-900 dark:text-white">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{destination.rating} / 5.0</span>
            </div>
          </div>

          <div className="space-y-4">
            {destination.reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <span>{rev.author}</span>
                    <span className="text-slate-400 font-normal">({rev.nationality})</span>
                    {rev.verifiedStay && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/10 text-emerald-600 font-bold">
                        Verified Visit
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-[11px]">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 360 Panorama Modal */}
      {showPanoramaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 text-white shadow-2xl overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-safar-teal-400" />
                <h3 className="font-bold text-lg text-white">360° Interactive View — {destination.name}</h3>
              </div>
              <button onClick={() => setShowPanoramaModal(false)} className="text-slate-400 hover:text-white p-2">
                ✕
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={destination.panoramaUrl}
                alt="360 Panorama"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold animate-pulse">
                  🔄 Drag or Tilt device to explore 360° view
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
