import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, AlertTriangle, ChevronRight, PhoneCall } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const { isSosActive, cancelSOS, alerts, setCurrentPage } = useApp();

  if (isSosActive) {
    return (
      <div className="bg-rose-600 text-white px-4 py-2.5 shadow-lg border-b border-rose-700 animate-pulse">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="w-5 h-5 shrink-0 animate-spin-slow" />
            <span>
              <strong>EMERGENCY SOS ACTIVE:</strong> Live coordinates transmitting to UP Tourist Police & Contacts.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentPage('sos')}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold backdrop-blur-sm transition-colors"
            >
              View Dispatch Beacon
            </button>
            <button
              onClick={cancelSOS}
              className="px-2.5 py-1 bg-white text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors"
            >
              I Am Safe (Cancel)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const criticalAlert = alerts.find(a => a.severity === 'critical' || a.severity === 'high');

  if (criticalAlert) {
    return (
      <div className="bg-amber-500 text-slate-950 px-4 py-2 border-b border-amber-600/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium truncate">
            <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950" />
            <span className="truncate">
              <strong>Safety Advisory ({criticalAlert.location}):</strong> {criticalAlert.title}
            </span>
          </div>
          <button
            onClick={() => setCurrentPage('safety')}
            className="flex items-center gap-1 font-semibold hover:underline shrink-0 text-xs"
          >
            <span>Details & Safe Route</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
