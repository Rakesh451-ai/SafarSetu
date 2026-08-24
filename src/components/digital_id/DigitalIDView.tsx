import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  QrCode,
  Download,
  Share2,
  PhoneCall,
  User,
  CheckCircle2,
  Lock,
  Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DigitalIDView: React.FC = () => {
  const { user, showToast, setQrScannerOpen } = useApp();
  const [showLargeQR, setShowLargeQR] = useState(false);

  const handleDownloadPDF = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    showToast({
      title: 'Digital Tourist Pass Downloaded',
      message: 'Saved to your device for offline paperless ASI monument entry.',
      type: 'success',
    });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(`SafarSetu Digital ID: ${user.id} - ${user.name}`);
    showToast({
      title: 'ID Link Copied',
      message: 'Digital ID reference copied to clipboard.',
      type: 'info',
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-4 animate-fade-in">
      
      {/* Heading */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-[#172033]">
          Digital Tourist ID
        </h1>
        <p className="text-xs text-slate-500">
          Official digital pass recognized at heritage monuments and tourist checkpoints.
        </p>
      </div>

      {/* Main Clean Digital ID Card */}
      <div className="safar-card overflow-hidden border border-slate-200 shadow-md bg-white">
        
        {/* Card Header (Deep Navy) */}
        <div className="bg-[#12355B] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs">
              <span className="text-[#F28C28]">स</span>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block leading-tight">SafarSetu Tourist ID</span>
              <span className="text-[10px] text-slate-300">Ministry of Tourism Verified</span>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified</span>
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          
          {/* User Info & Photo */}
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200"
            />
            <div className="space-y-0.5">
              <h2 className="font-bold text-base text-[#172033]">{user.name}</h2>
              <p className="font-mono text-xs font-semibold text-[#168A72]">{user.id}</p>
              <p className="text-xs text-slate-500">{user.nationality} • Blood Group: {user.bloodGroup}</p>
            </div>
          </div>

          {/* QR Code Section */}
          <div
            onClick={() => setShowLargeQR(prev => !prev)}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center cursor-pointer hover:bg-slate-100 transition-colors space-y-2"
          >
            <img
              src={user.qrCodeUrl}
              alt="QR Code"
              className="w-28 h-28 mx-auto"
            />
            <span className="text-[11px] font-semibold text-slate-600 block">
              Tap to enlarge QR Pass
            </span>
          </div>

          {/* Emergency Contact & Safety Info */}
          <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-slate-600">
              <span>Emergency Contact:</span>
              <strong className="text-slate-800">{user.emergencyContacts[0]?.name} ({user.emergencyContacts[0]?.relationship})</strong>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Emergency Phone:</span>
              <strong className="text-slate-800 font-mono">{user.emergencyContacts[0]?.phone}</strong>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Safety Status:</span>
              <span className="font-bold text-emerald-600">🟢 Safe Zone</span>
            </div>
          </div>

        </div>

        {/* Card Footer Verification Bar */}
        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#168A72]" /> Encrypted Credentials
          </span>
          <span>Valid: 2026-2027</span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setQrScannerOpen(true)}
          className="py-2.5 px-3 rounded-xl bg-[#12355B] hover:bg-[#0E2845] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Scan QR</span>
        </button>

        <button
          onClick={handleDownloadPDF}
          className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>

        <button
          onClick={handleShare}
          className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Large QR Modal */}
      {showLargeQR && (
        <div
          onClick={() => setShowLargeQR(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="bg-white p-6 rounded-2xl max-w-xs w-full text-center space-y-3 shadow-xl">
            <h3 className="font-bold text-sm text-[#172033]">Monument Gate Entry Pass</h3>
            <img src={user.qrCodeUrl} alt="Large QR" className="w-48 h-48 mx-auto" />
            <p className="text-xs text-slate-500">Scan at ASI monument turnstile</p>
          </div>
        </div>
      )}

    </div>
  );
};
