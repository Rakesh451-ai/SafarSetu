import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  X,
  CheckCircle2
} from 'lucide-react';

export const SOSModal: React.FC = () => {
  const { isSosModalOpen, setSosModalOpen, triggerSOS, isSosActive, cancelSOS, user } = useApp();
  const [hasSent, setHasSent] = useState(false);

  if (!isSosModalOpen && !isSosActive) return null;

  const handleConfirmSOS = () => {
    triggerSOS();
    setHasSent(true);
  };

  const handleClose = () => {
    if (isSosActive) {
      cancelSOS();
    }
    setHasSent(false);
    setSosModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-5 shadow-2xl">
        
        {/* Large SOS Icon */}
        <div className="w-16 h-16 rounded-full bg-red-100 text-[#DC2626] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-9 h-9" />
        </div>

        {/* SOS Confirmation Content */}
        {!isSosActive && !hasSent ? (
          <>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-[#172033]">
                Send Emergency SOS?
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your live GPS location will be immediately shared with <strong>112 Emergency Police</strong> and your emergency contact (<strong>{user.emergencyContacts[0]?.name}</strong>).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleConfirmSOS}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-[#DC2626] hover:bg-red-700 active:scale-98 transition-colors shadow-sm"
              >
                Send SOS Now
              </button>

              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          /* SOS Active Beacon State */
          <>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                SOS Beacon Active
              </span>
              <h2 className="text-lg font-bold text-[#172033]">
                Emergency Signal Broadcasted
              </h2>
              <p className="text-xs text-slate-600">
                Help is being notified. Stay in a safe, lit area.
              </p>
            </div>

            {/* Direct Dial Shortcuts */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span>National Emergency:</span>
                <a href="tel:112" className="font-bold text-red-600 underline">Call 112</a>
              </div>
              <div className="flex justify-between items-center">
                <span>Tourist Police Helpline:</span>
                <a href="tel:1363" className="font-bold text-[#168A72] underline">Call 1363</a>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel SOS / I Am Safe
            </button>
          </>
        )}

      </div>
    </div>
  );
};
