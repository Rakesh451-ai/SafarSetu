import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SAFETY_ZONES_DATA, EMERGENCY_NUMBERS } from '../../data/safetyData';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  PhoneCall,
  Navigation,
  Clock,
  Radio,
  FilePlus2,
  CheckCircle2,
  Users,
  Eye,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const LiveSafetyCenterView: React.FC = () => {
  const { alerts, dismissAlert, setCurrentPage, setSosModalOpen, showToast } = useApp();
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportType, setReportType] = useState<string>('Crowd / Traffic Congestion');
  const [reportDetails, setReportDetails] = useState<string>('');

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDetails) return;
    setShowReportModal(false);
    setReportDetails('');
    showToast({
      title: '✓ Incident Advisory Submitted',
      message: 'Your report has been dispatched to UP Tourist Police Command Center for review.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Live Safety Network
            </span>
            <span className="text-xs text-slate-400">24x7 Geofenced Tourist Protection</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white mt-1">
            Live Safety Center & Geofence Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time hazard perimeter monitoring, active crowd advisories, and instant emergency dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FilePlus2 className="w-4 h-4 text-safar-saffron-500" />
            <span>Report Safety Incident</span>
          </button>

          <button
            onClick={() => setSosModalOpen(true)}
            className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>Trigger SOS</span>
          </button>
        </div>
      </div>

      {/* Geofence Zone Categories Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Safe Zone */}
        <div className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-base text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              🟢 Safe Geofence Zone
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              Active CCTV
            </span>
          </div>
          <p className="text-xs text-emerald-900/80 dark:text-emerald-200 leading-relaxed">
            Continuous police patrol, verified transport corridors, and high illumination. Zero incident history.
          </p>
        </div>

        {/* 2. Caution Zone */}
        <div className="p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-base text-amber-800 dark:text-amber-300 flex items-center gap-2">
              🟡 Caution Geofence Zone
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
              Crowd Warning
            </span>
          </div>
          <p className="text-xs text-amber-900/80 dark:text-amber-200 leading-relaxed">
            Elevated crowd density, ongoing construction, or peak traffic hours. Keep digital pass handy.
          </p>
        </div>

        {/* 3. Danger Zone */}
        <div className="p-5 rounded-3xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-base text-rose-800 dark:text-rose-300 flex items-center gap-2">
              🔴 Danger / Restricted
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-700 dark:text-rose-300">
              Restricted Area
            </span>
          </div>
          <p className="text-xs text-rose-900/80 dark:text-rose-200 leading-relaxed">
            Unlit natural riverbeds, isolated ravines, or flash surge trails. Entry strictly prohibited after dusk.
          </p>
        </div>
      </div>

      {/* Active Alerts Live Feed */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <span>Active Regional Safety Advisories</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synchronized with State Disaster Management & Police Feeds
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {alerts.length} Active Alerts
          </span>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all ${
                alert.type === 'danger'
                  ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-500/30'
                  : alert.type === 'caution'
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-500/30'
                  : 'bg-cyan-50/60 dark:bg-cyan-950/20 border-cyan-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    alert.type === 'danger' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {alert.type === 'danger' ? '⛔ Severe' : '⚠️ Caution Alert'}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {alert.title}
                  </h4>
                </div>
                <span className="text-xs text-slate-500 font-mono">{alert.timestamp} • {alert.location}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                {alert.description}
              </p>

              {alert.alternativeRoute && (
                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Alternative Safe Route Available
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{alert.alternativeRoute}</p>
                </div>
              )}

              <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => setCurrentPage('map')}
                  className="font-bold text-safar-teal-600 dark:text-safar-teal-400 hover:underline flex items-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View Safe Route On Live Map</span>
                </button>

                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-slate-400 hover:text-slate-600 text-[11px]"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Helpline Hotline Directory */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="font-display font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-500" />
            <span>Official 24x7 Emergency Contact Directory</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            One-tap direct dial to government and emergency tourist response networks
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_NUMBERS.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">{item.service}</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <span className="font-mono font-black text-base text-safar-teal-600 dark:text-safar-teal-400">{item.number}</span>
                <a
                  href={`tel:${item.number.split('/')[0].trim()}`}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Incident Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl space-y-4 animate-scale-in">
            <h3 className="font-display font-bold text-lg">Report Tourist Safety Advisory</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Help fellow travelers by reporting unlisted road closures, aggressive vendors, or sudden crowd surges.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Incident Category</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-safar-saffron-500"
                >
                  <option value="Crowd / Traffic Congestion">Crowd / Traffic Congestion</option>
                  <option value="Unauthorized / Fake Guide Activity">Unauthorized / Fake Guide Activity</option>
                  <option value="Hazardous / Slippery Trail Condition">Hazardous / Slippery Trail Condition</option>
                  <option value="Lost Property / Missing Belonging">Lost Property / Missing Belonging</option>
                  <option value="Medical Assistance Required">Medical Assistance Required</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Details & Landmark</label>
                <textarea
                  rows={3}
                  placeholder="Describe location, what happened, and any assistance needed..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-safar-saffron-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-safar-saffron-500 text-white hover:bg-safar-saffron-600 shadow-sm"
                >
                  Submit Advisory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
