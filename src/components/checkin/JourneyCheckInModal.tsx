import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  User,
  Users,
  ShieldAlert,
  X,
  Plus
} from 'lucide-react';

export const JourneyCheckInModal: React.FC = () => {
  const { isCheckInModalOpen, setCheckInModalOpen, user, performCheckIn, extendCheckInTime } = useApp();

  if (!isCheckInModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-slate-900 dark:text-slate-100">
                Journey Safety Check-In
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Automated safety verification & escalation</p>
            </div>
          </div>
          <button
            onClick={() => setCheckInModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status card */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-safar-saffron-500" />
              <span>Current City: <strong>{user.currentTrip.currentCity}, {user.currentTrip.state}</strong></span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Active Track
            </span>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Next Check-In Due In
            </span>
            <div className="font-display font-black text-4xl text-slate-900 dark:text-slate-100 my-1">
              {user.checkInDueMinutes} <span className="text-lg font-medium text-slate-500">minutes</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Last check-in logged: <span className="text-slate-700 dark:text-slate-300 font-medium">{user.lastCheckIn}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={performCheckIn}
            className="py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Check In Now (I Am Safe)</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => extendCheckInTime(30)}
              className="flex-1 py-3 px-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> 30 Mins
            </button>
            <button
              onClick={() => extendCheckInTime(60)}
              className="flex-1 py-3 px-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> 1 Hour
            </button>
          </div>
        </div>

        {/* Visual Escalation Protocol Ladder */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Missed Check-In Escalation Protocol</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {/* Step 1 */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <div className="w-7 h-7 mx-auto rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-1.5 font-bold text-xs">
                1
              </div>
              <div className="font-bold text-[11px] text-slate-800 dark:text-slate-200">Tourist Ping</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Push notification & audio prompt</div>
            </div>

            {/* Step 2 */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <div className="w-7 h-7 mx-auto rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5 font-bold text-xs">
                2
              </div>
              <div className="font-bold text-[11px] text-slate-800 dark:text-slate-200">Next of Kin</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Automated SMS to Emergency Contacts</div>
            </div>

            {/* Step 3 */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <div className="w-7 h-7 mx-auto rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1.5 font-bold text-xs">
                3
              </div>
              <div className="font-bold text-[11px] text-slate-800 dark:text-slate-200">Police Unit</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Local Tourist Patrol Dispatch</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
