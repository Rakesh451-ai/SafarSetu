import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EMERGENCY_NUMBERS } from '../../data/safetyData';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  PhoneCall,
  Navigation,
  FilePlus2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const LiveSafetyCenterView: React.FC = () => {
  const { alerts, dismissAlert, setCurrentPage, setSosModalOpen, showToast } = useApp();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setShowReportModal(false);
    setReportText('');
    showToast({
      title: 'Safety Report Submitted',
      message: 'Thank you. Your advisory has been forwarded to local tourist safety authorities.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fade-in">
      
      {/* Page Heading */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#172033]">
            Travel Safety
          </h1>
          <p className="text-sm text-slate-500">
            Real-time safety status, regional hazard alerts, and emergency contact numbers.
          </p>
        </div>

        <button
          onClick={() => setSosModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Emergency SOS</span>
        </button>
      </section>

      {/* 1. Top Safety Status Banner */}
      <section className="safar-card p-5 bg-emerald-50/60 border-emerald-200 flex items-start gap-3.5">
        <span className="w-3 h-3 rounded-full bg-emerald-600 mt-1 shrink-0 animate-pulse" />
        <div className="space-y-1">
          <h2 className="text-base font-bold text-emerald-900">
            🟢 You are in a Safe Zone
          </h2>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Your current sector (Agra Heritage Zone) has active tourist police kiosks and normal traffic conditions.
          </p>
        </div>
      </section>

      {/* 2. Nearby Safety Alerts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#172033]">Nearby Alerts</h2>
          <span className="text-xs font-medium text-slate-500">{alerts.length} active advisories</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const isCaution = alert.type === 'caution';
            const isDanger = alert.type === 'danger';

            return (
              <div
                key={alert.id}
                className={`safar-card p-4 space-y-2.5 ${
                  isDanger
                    ? 'bg-red-50/50 border-red-200'
                    : isCaution
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span>{isDanger ? '🔴' : isCaution ? '🟡' : '🟢'}</span>
                    <h3 className="font-bold text-sm text-[#172033]">
                      {alert.title}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{alert.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {alert.description}
                </p>

                {alert.alternativeRoute && (
                  <div className="ml-6 p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 flex items-center justify-between gap-2">
                    <span>💡 Alternative Route: {alert.alternativeRoute}</span>
                    <button
                      onClick={() => setCurrentPage('map')}
                      className="text-xs font-bold text-[#168A72] hover:underline whitespace-nowrap"
                    >
                      View on Map →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Emergency Contacts Directory */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#172033]">Emergency Helplines</h2>
          <p className="text-xs text-slate-500">Tap to call official emergency numbers immediately</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EMERGENCY_NUMBERS.slice(0, 4).map((item, idx) => (
            <div key={idx} className="safar-card p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#172033]">{item.service}</h3>
                <p className="text-xs text-slate-500">{item.description}</p>
                <span className="text-xs font-bold text-[#168A72] font-mono mt-1 block">{item.number}</span>
              </div>

              <a
                href={`tel:${item.number.split('/')[0].trim()}`}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Report Safety Issue Button */}
      <section className="pt-2 text-center">
        <button
          onClick={() => setShowReportModal(true)}
          className="text-xs font-semibold text-[#12355B] hover:underline"
        >
          Have a safety concern or road block to report? Report here →
        </button>
      </section>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-[#172033]">Report Safety Advisory</h3>
            <p className="text-xs text-slate-500">
              Share details about traffic jams, unlit roads, or safety hazards to inform local authorities.
            </p>
            <form onSubmit={handleReportSubmit} className="space-y-3">
              <textarea
                rows={3}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Describe the location and issue..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#12355B]"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#12355B] hover:bg-[#0E2845]"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
