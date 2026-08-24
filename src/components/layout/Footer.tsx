import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, ShieldCheck, PhoneCall, Globe, Heart, ExternalLink, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1 & 2: Platform Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-safar-navy-800 to-safar-teal-600 text-white shadow-md">
                <Compass className="w-6 h-6 text-safar-saffron-400" />
              </div>
              <div>
                <span className="font-display font-black text-xl text-white tracking-tight">SafarSetu</span>
                <span className="ml-2 text-xs font-bold px-1.5 py-0.5 rounded bg-safar-saffron-500/20 text-safar-saffron-400 border border-safar-saffron-500/30">
                  सफ़र सेतु
                </span>
                <p className="text-xs text-slate-400">Unified Digital Tourist Identity & Real-Time Safety Platform</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Empowering national and international travelers with verified destination insights, geo-fenced safety radar, AI itinerary copilot, and instantaneous emergency response integration across India.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ministry of Tourism Partner Ready</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <Lock className="w-3.5 h-3.5 text-safar-saffron-400" />
                <span>256-bit Encrypted ID</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Features */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentPage('digital_id')} className="hover:text-safar-saffron-400 transition-colors">
                  Digital Tourist ID & QR
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('map')} className="hover:text-safar-saffron-400 transition-colors">
                  Interactive Safety Map
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('assistant')} className="hover:text-safar-saffron-400 transition-colors">
                  SafarSetu AI Copilot
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('itinerary')} className="hover:text-safar-saffron-400 transition-colors">
                  Smart Itinerary Builder
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('offline')} className="hover:text-safar-saffron-400 transition-colors">
                  Offline Travel Packs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety & Services */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Safety & Marketplace</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentPage('safety')} className="hover:text-safar-saffron-400 transition-colors">
                  Live Safety Center & Geofences
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('checkin')} className="hover:text-safar-saffron-400 transition-colors">
                  Journey Check-In System
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('services')} className="hover:text-safar-saffron-400 transition-colors">
                  Verified Guides & Stays
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('admin')} className="hover:text-safar-saffron-400 transition-colors">
                  Command Center (Admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Emergency Hotlines */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> Emergency 24x7
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
                <div className="text-[11px] text-slate-400">National Emergency SOS</div>
                <div className="font-bold text-rose-400 text-sm">Dial 112</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80">
                <div className="text-[11px] text-slate-400">Incredible India Helpline</div>
                <div className="font-bold text-safar-teal-400 text-sm">1363 / 1800 11 1363</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 SafarSetu (सफ़र सेतु) • National Tourist Safety & Heritage Digital Initiative
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Tourism
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
