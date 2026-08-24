import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  QrCode,
  Sparkles,
  ArrowRight,
  Play,
  Languages,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentPage, setSelectedDestinationId, setQrScannerOpen, t } = useApp();
  const [activePin, setActivePin] = useState<string>('agra');

  const routePins = [
    { id: 'delhi', name: 'Delhi', state: 'Red Fort & Qutub', coords: 'top-[26%] left-[34%]', tag: 'Heritage Hub', color: 'emerald' },
    { id: 'agra', name: 'Agra', state: 'Taj Mahal Complex', coords: 'top-[33%] left-[38%]', tag: '🟢 Safe Zone', color: 'saffron', destId: 'taj-mahal' },
    { id: 'jaipur', name: 'Jaipur', state: 'Amber & City Palace', coords: 'top-[31%] left-[28%]', tag: 'Royal Circuit', color: 'emerald', destId: 'amber-fort' },
    { id: 'varanasi', name: 'Varanasi', state: 'Ghats & Sarnath', coords: 'top-[38%] left-[54%]', tag: 'Spiritual Riverfront', color: 'amber', destId: 'varanasi-ghats' },
    { id: 'hampi', name: 'Hampi', state: 'Vittala Boulder Ruins', coords: 'top-[68%] left-[36%]', tag: 'UNESCO Wonder', color: 'emerald', destId: 'hampi-ruins' },
    { id: 'munnar', name: 'Munnar', state: 'Western Ghats Eco-Trail', coords: 'top-[84%] left-[38%]', tag: 'Tea Mist & Wildlife', color: 'teal', destId: 'munnar-hills' },
  ];

  return (
    <section className="relative overflow-hidden pt-6 sm:pt-10 pb-16 lg:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-safar-navy-800/10 via-safar-saffron-500/15 to-safar-teal-500/15 dark:from-safar-navy-900/30 dark:via-safar-saffron-500/10 dark:to-safar-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Trust Ribbon */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md text-xs font-semibold text-slate-700 dark:text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-safar-saffron-600 dark:text-safar-saffron-400 font-bold">Incredible India</span>
            <span>• Verified Digital Safety & Multilingual Guide System</span>
          </div>
        </div>

        {/* Hero Grid: Left Content + Right Interactive Visual Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left 6 cols: Headline & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-slate-950 dark:text-white tracking-tight leading-[1.12]">
              Explore India.{' '}
              <span className="bg-gradient-to-r from-safar-saffron-500 via-amber-500 to-safar-saffron-600 bg-clip-text text-transparent">
                Travel Smarter.
              </span>{' '}
              <span className="bg-gradient-to-r from-safar-teal-600 to-emerald-500 dark:from-safar-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Stay Safer.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Your digital companion for verified tourist information, intelligent AI travel planning, real-time geofenced safety alerts, and instantaneous emergency response assistance across 500+ Indian destinations.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => setCurrentPage('digital_id')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-display font-bold text-sm sm:text-base text-white bg-gradient-to-r from-safar-navy-950 via-safar-navy-800 to-safar-navy-900 hover:from-safar-navy-900 hover:to-safar-navy-800 border border-safar-navy-700/60 shadow-xl shadow-safar-navy-950/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105"
              >
                <ShieldCheck className="w-5 h-5 text-safar-saffron-400" />
                <span>Get Your Digital Tourist ID</span>
                <ArrowRight className="w-4 h-4 text-safar-saffron-400" />
              </button>

              <button
                onClick={() => setCurrentPage('destination')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-display font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md flex items-center justify-center gap-2 transition-all"
              >
                <Compass className="w-5 h-5 text-safar-teal-600 dark:text-safar-teal-400" />
                <span>Explore Destinations</span>
              </button>
            </div>

            {/* Micro assurances */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-safar-saffron-500" />
                <span>Aadhaar/Passport Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-cyan-500" />
                <span>10+ Languages</span>
              </div>
            </div>
          </div>

          {/* Right 6 cols: Interactive India Journey Canvas */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-safar-navy-950 to-slate-900 text-white border border-slate-800 shadow-2xl shadow-safar-navy-950/40 overflow-hidden">
              
              {/* Decorative Map Graphic Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-safar-teal-400 font-bold">
                    LIVE TOURIST JOURNEY RADAR
                  </div>
                  <div className="font-display font-black text-lg text-white">
                    Golden Triangle & Cultural Circuit
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPage('map')}
                  className="px-3 py-1.5 rounded-xl bg-safar-teal-500/20 hover:bg-safar-teal-500/30 text-safar-teal-300 border border-safar-teal-500/30 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* India Map stylized container */}
              <div className="relative h-[320px] sm:h-[380px] w-full rounded-2xl bg-slate-950/80 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                
                {/* Visual radar grid lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

                {/* Simulated India Outline Map SVG */}
                <svg
                  className="w-full h-full text-slate-800/80 stroke-slate-700/60"
                  viewBox="0 0 400 480"
                  fill="currentColor"
                >
                  <path
                    d="M 170 30 L 220 50 L 250 110 L 280 140 L 330 180 L 310 220 L 260 210 L 230 250 L 220 330 L 190 410 L 160 440 L 150 400 L 140 330 L 100 280 L 80 220 L 110 160 L 130 110 Z"
                    className="fill-slate-900/60 stroke-safar-teal-500/30 stroke-2"
                  />
                  {/* Route Polyline connecting destinations */}
                  <polyline
                    points="140,120 160,150 120,140 220,180 150,320 160,390"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="3"
                    strokeDasharray="6,4"
                    className="animate-pulse"
                  />
                </svg>

                {/* Pulsing Interactive Pins */}
                {routePins.map((pin) => {
                  const isActive = activePin === pin.id;
                  return (
                    <button
                      key={pin.id}
                      onClick={() => {
                        setActivePin(pin.id);
                        if (pin.destId) setSelectedDestinationId(pin.destId);
                      }}
                      className={`absolute ${pin.coords} -translate-x-1/2 -translate-y-1/2 group transition-all z-20`}
                    >
                      <div className="relative flex items-center justify-center">
                        <span className={`absolute w-7 h-7 rounded-full animate-ping ${
                          pin.color === 'saffron' ? 'bg-safar-saffron-500/40' : 'bg-emerald-500/40'
                        }`} />
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg transition-transform group-hover:scale-125 ${
                          isActive
                            ? 'bg-safar-saffron-500 ring-4 ring-safar-saffron-400/40 scale-110'
                            : pin.color === 'saffron'
                            ? 'bg-safar-saffron-600'
                            : 'bg-emerald-600'
                        }`}>
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Pin tooltip card */}
                      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-44 p-2.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl backdrop-blur-md transition-all text-left pointer-events-none ${
                        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{pin.name}</span>
                          <span className="text-[9px] font-semibold text-emerald-400">{pin.tag}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{pin.state}</p>
                      </div>
                    </button>
                  );
                })}

                {/* Floating active card bottom */}
                <div className="absolute bottom-3 inset-x-3 p-3 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-lg backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      🟢
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">
                        {routePins.find(p => p.id === activePin)?.name || 'Agra'}: High Safety Score (4.9/5)
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {routePins.find(p => p.id === activePin)?.state} • 24x7 Tourist Police Active
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const pin = routePins.find(p => p.id === activePin);
                      if (pin?.destId) {
                        setSelectedDestinationId(pin.destId);
                        setCurrentPage('destination');
                      } else {
                        setCurrentPage('destination');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white font-bold text-[11px] transition-colors"
                  >
                    View Guide
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Animated Statistics Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white">
              500+
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Verified Destinations
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">ASI & Tourism Board Certified</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="font-display font-black text-2xl sm:text-4xl text-safar-teal-600 dark:text-safar-teal-400">
              24/7
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Safety Assistance
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Direct 1363 & 112 Dispatch</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="font-display font-black text-2xl sm:text-4xl text-safar-saffron-500">
              10+
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Indian Languages
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Multilingual Voice & Audio</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <div className="font-display font-black text-2xl sm:text-4xl text-emerald-600 dark:text-emerald-400">
              Live
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
              Real-Time Alerts
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Geofence & Crowd Telemetry</div>
          </div>
        </div>

      </div>
    </section>
  );
};
