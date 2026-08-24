import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, PhoneCall } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-8 mt-12 mb-16 md:mb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#12355B] text-white flex items-center justify-center font-bold text-xs">
            <span className="text-[#F28C28]">स</span>
          </div>
          <span className="font-bold text-slate-800">SafarSetu</span>
          <span>•</span>
          <span>Digital Tourist Guide & Safety Platform</span>
        </div>

        {/* Emergency Helpline Quick Reference */}
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-slate-700">
            <PhoneCall className="w-3.5 h-3.5 text-[#168A72]" /> Tourist Helpline: <strong>1363</strong>
          </span>
          <span>•</span>
          <span className="text-slate-700">
            Emergency SOS: <strong>112</strong>
          </span>
        </div>

        <div className="text-slate-400">
          © 2026 SafarSetu • Verified Tourist Safety
        </div>

      </div>
    </footer>
  );
};
