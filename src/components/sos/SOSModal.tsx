import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  AlertTriangle,
  PhoneCall,
  MapPin,
  Battery,
  Wifi,
  Volume2,
  VolumeX,
  X,
  Radio,
  UserCheck
} from 'lucide-react';

export const SOSModal: React.FC = () => {
  const { isSosModalOpen, setSosModalOpen, triggerSOS, user } = useApp();
  const [countdown, setCountdown] = useState<number>(5);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSirenOn, setIsSirenOn] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (isSosModalOpen && countdown > 0 && !isPaused) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isSosModalOpen && countdown === 0) {
      triggerSOS();
    }
    return () => clearTimeout(timer);
  }, [isSosModalOpen, countdown, isPaused]);

  // Reset countdown when opened
  useEffect(() => {
    if (isSosModalOpen) {
      setCountdown(5);
      setIsPaused(false);
    }
  }, [isSosModalOpen]);

  if (!isSosModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl shadow-rose-950/60 overflow-hidden relative animate-scale-in">
        
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between relative z-10 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-500 border border-rose-500/30 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-rose-400 tracking-tight">Emergency SOS Dispatch</h3>
              <p className="text-xs text-slate-400">Immediate Rapid Response & Location Broadcast</p>
            </div>
          </div>
          <button
            onClick={() => setSosModalOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Countdown Center */}
        <div className="text-center my-6 relative z-10">
          <div className="relative inline-flex items-center justify-center">
            {/* Pulsing ring */}
            <div className="w-28 h-28 rounded-full border-4 border-rose-500/40 animate-ping absolute" />
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-700 to-rose-900 border-4 border-rose-500 flex flex-col items-center justify-center shadow-lg shadow-rose-600/40">
              <span className="font-display font-black text-4xl leading-none">{countdown}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-200 mt-1">Seconds</span>
            </div>
          </div>

          <p className="text-sm font-medium text-slate-200 mt-4 max-w-sm mx-auto leading-relaxed">
            Broadcasting live GPS coordinates & tourist profile to <strong>UP Tourist Police (1363)</strong> and emergency contacts in <span className="text-rose-400 font-bold">{countdown} seconds</span>.
          </p>

          <div className="flex items-center justify-center gap-3 mt-3">
            <button
              onClick={() => setIsPaused(prev => !prev)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {isPaused ? '▶ Resume Countdown' : '⏸ Pause Countdown'}
            </button>
            <button
              onClick={() => setIsSirenOn(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isSirenOn ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isSirenOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isSirenOn ? 'Audible Alarm ON' : 'Test Siren Alarm'}</span>
            </button>
          </div>
        </div>

        {/* Live Telemetry Card */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 mb-6 space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> Current Coordinates
            </span>
            <span className="font-mono font-bold text-white">27.1751° N, 78.0421° E (±4m)</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Radio className="w-3.5 h-3.5 text-emerald-400" /> Last Known Geofence
            </span>
            <span className="font-medium text-emerald-400">Taj East Gate Tourist Zone, Agra</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
              <span>Battery: 68%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-cyan-400" />
              <span>Network: 5G Airtel</span>
            </div>
            <div className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-safar-saffron-400" />
              <span>ID: {user.id}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 relative z-10">
          <button
            onClick={triggerSOS}
            className="w-full py-3.5 px-4 rounded-xl font-display font-black text-sm tracking-wider uppercase text-white bg-rose-600 hover:bg-rose-500 active:scale-98 shadow-lg shadow-rose-600/40 transition-all flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span>TRIGGER SOS IMMEDIATELY</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:112"
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span>Call Police (112)</span>
            </a>
            <a
              href="tel:1363"
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tourist Police (1363)</span>
            </a>
          </div>

          <button
            onClick={() => setSosModalOpen(false)}
            className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel / False Alarm
          </button>
        </div>
      </div>
    </div>
  );
};
