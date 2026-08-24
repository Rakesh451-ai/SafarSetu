import React from 'react';
import { useApp } from '../../context/AppContext';
import { DESTINATIONS_DATA } from '../../data/destinationsData';
import { Camera, X, QrCode, Sparkles } from 'lucide-react';

export const QRScannerModal: React.FC = () => {
  const { isQrScannerOpen, setQrScannerOpen, setSelectedDestinationId, setCurrentPage, showToast } = useApp();

  if (!isQrScannerOpen) return null;

  const handleSimulateScan = (destinationId: string) => {
    const dest = DESTINATIONS_DATA.find(d => d.id === destinationId);
    setQrScannerOpen(false);
    setSelectedDestinationId(destinationId);
    setCurrentPage('destination');

    showToast({
      title: 'QR Code Scanned',
      message: `Verified ASI guide loaded for ${dest?.name || 'Monument'}.`,
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <Camera className="w-4 h-4 text-[#12355B]" />
            <h2 className="font-bold text-sm text-[#172033]">Scan Monument QR</h2>
          </div>
          <button
            onClick={() => setQrScannerOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative aspect-square max-w-[200px] mx-auto rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300">
          <QrCode className="w-20 h-20 text-white/20" />
          <div className="absolute inset-x-4 top-1/2 h-0.5 bg-[#F28C28] animate-pulse" />
        </div>

        <p className="text-xs text-slate-500">
          Point camera at official ASI monument QR codes or police information kiosks.
        </p>

        {/* Quick Demo Scan Buttons */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 block">Or test with demo QR:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleSimulateScan('taj-mahal')}
              className="flex-1 py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
            >
              🏛️ Taj Mahal
            </button>
            <button
              onClick={() => handleSimulateScan('amber-fort')}
              className="flex-1 py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
            >
              🏰 Amber Fort
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
