import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
  CheckCircle2,
  HardDrive,
  Map as MapIcon,
  Headphones,
  PhoneCall,
  FileText,
  Trash2,
  Sparkles,
  WifiOff,
  Clock,
  ArrowDown
} from 'lucide-react';

export const OfflinePackManagerView: React.FC = () => {
  const { offlinePacks, toggleDownloadPack, showToast } = useApp();

  const downloadedSize = offlinePacks
    .filter(p => p.isDownloaded)
    .reduce((acc, p) => acc + p.sizeMB, 0);

  const totalStorageMB = 2048; // 2 GB allocated
  const usedPercentage = Math.round((downloadedSize / totalStorageMB) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
              <WifiOff className="w-3.5 h-3.5" /> Zero Connectivity Ready
            </span>
            <span className="text-xs text-slate-400">Offline Audio & Vector Maps</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white mt-1">
            Offline Travel Pack Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Download regional destination packs for uninterrupted safety tracking and audio guides in low network zones.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
          <HardDrive className="w-8 h-8 text-safar-teal-500" />
          <div className="text-xs">
            <div className="text-slate-500 dark:text-slate-400">Offline Storage Used</div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              {downloadedSize} MB <span className="text-slate-400 font-normal">/ {totalStorageMB / 1024} GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Progress Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-700 dark:text-slate-300">Device Cache Allocation ({usedPercentage}%)</span>
          <span className="text-safar-teal-600 dark:text-safar-teal-400">{totalStorageMB - downloadedSize} MB Available</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-safar-teal-500 to-safar-saffron-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(4, usedPercentage)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Vector Maps (52 MB)</span>
          <span>•</span>
          <span>Audio Narration (124 MB)</span>
          <span>•</span>
          <span>Emergency Offline DB (20 MB)</span>
        </div>
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offlinePacks.map((pack) => (
          <div
            key={pack.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-5"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    pack.status === 'downloaded'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : pack.status === 'downloading'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {pack.status === 'downloaded' ? '🟢 Available Offline' : pack.status === 'downloading' ? '🟡 Downloading' : '⚪ Online Only'}
                  </span>
                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white mt-1.5">
                    {pack.destinationName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{pack.state}</p>
                </div>

                <span className="font-mono font-bold text-xs text-slate-600 dark:text-slate-300 shrink-0">
                  {pack.sizeMB} MB
                </span>
              </div>

              {/* Items Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <MapIcon className="w-3.5 h-3.5 text-safar-teal-500" />
                  <span>{pack.itemsCount.maps} Vector Maps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-safar-saffron-500" />
                  <span>{pack.itemsCount.audioHours} hrs Audio</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{pack.itemsCount.guides} Heritage Guides</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
                  <span>{pack.itemsCount.emergencyContacts} Police & Help Contacts</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {pack.isDownloaded ? (
                <>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved to device</span>
                  </div>

                  <button
                    onClick={() => toggleDownloadPack(pack.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-xs font-semibold flex items-center gap-1"
                    title="Remove Pack"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="text-[11px] text-slate-400">
                    Offline access without internet
                  </div>

                  <button
                    onClick={() => toggleDownloadPack(pack.id)}
                    className="px-4 py-2 rounded-xl bg-safar-navy-900 dark:bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Pack</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
