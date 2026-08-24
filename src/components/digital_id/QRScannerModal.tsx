import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  X,
  Flashlight,
  SwitchCamera,
  Compass,
  CheckCircle2,
  Sparkles,
  MapPin
} from 'lucide-react';

export const QRScannerModal: React.FC = () => {
  const { isQrScannerOpen, setQrScannerOpen, setCurrentPage, setSelectedDestinationId, showToast } = useApp();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scanningStatus, setScanningStatus] = useState<string | null>(null);

  if (!isQrScannerOpen) return null;

  const sampleQRs = [
    { id: 'taj-mahal', label: 'Taj Mahal East Gate (Agra)', code: 'SAFARSETU-POI-AGR-001' },
    { id: 'amber-fort', label: 'Amber Fort Suraj Pol (Jaipur)', code: 'SAFARSETU-POI-JAI-001' },
    { id: 'varanasi-ghats', label: 'Dashashwamedh Ghat (Varanasi)', code: 'SAFARSETU-POI-VNS-001' },
    { id: 'munnar-hills', label: 'Eravikulam National Park (Munnar)', code: 'SAFARSETU-POI-KER-001' },
  ];

  const handleSimulateScan = (destId: string, label: string) => {
    setScanningStatus(`Verified: ${label}`);
    setTimeout(() => {
      setSelectedDestinationId(destId);
      setQrScannerOpen(false);
      setCurrentPage('destination');
      showToast({
        title: '✓ Monument QR Code Verified',
        message: `Audio guide, 360° panorama & safety brief for ${label} unlocked.`,
        type: 'success',
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-safar-teal-500/20 text-safar-teal-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-white">
                SafarSetu QR Scanner
              </h3>
              <p className="text-xs text-slate-400">Scan verified location & monument QR codes</p>
            </div>
          </div>
          <button
            onClick={() => setQrScannerOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="my-6 relative aspect-square max-w-xs mx-auto rounded-3xl bg-slate-950 border-2 border-slate-800 overflow-hidden flex items-center justify-center">
          {/* Laser scanning bar */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-safar-teal-400 to-transparent shadow-lg shadow-safar-teal-500 animate-bounce" />

          {/* Reticle corner markers */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-safar-saffron-500 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-safar-saffron-500 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-safar-saffron-500 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-safar-saffron-500 rounded-br-lg" />

          {/* Central Target Icon */}
          <div className="text-center p-6 space-y-2">
            <QrCode className="w-16 h-16 mx-auto text-slate-700 animate-pulse" />
            <p className="text-xs text-slate-400 font-medium">
              {scanningStatus || 'Point camera at official SafarSetu or ASI QR badge'}
            </p>
          </div>

          {/* Flash and camera toggle buttons inside viewfinder */}
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-4">
            <button
              onClick={() => setIsFlashOn(prev => !prev)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${
                isFlashOn ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800/80 text-slate-300'
              }`}
              title="Flashlight"
            >
              <Flashlight className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast({ title: 'Camera Switched', message: 'Front/Back camera toggled.', type: 'info' })}
              className="p-2.5 rounded-full bg-slate-800/80 text-slate-300 backdrop-blur-md hover:bg-slate-700 transition-colors"
              title="Switch Camera"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Simulation Scanner Chips */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Instant Demo QR Codes</span>
            <span className="text-safar-saffron-400 text-[10px]">Click to scan</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {sampleQRs.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSimulateScan(item.id, item.label)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-safar-navy-800 border border-slate-700 hover:border-safar-teal-500 text-left transition-all text-xs group"
              >
                <div className="flex items-center gap-1.5 text-safar-saffron-400 font-semibold truncate group-hover:text-safar-teal-400">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="font-mono text-[10px] text-slate-400 mt-1 truncate">{item.code}</div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
