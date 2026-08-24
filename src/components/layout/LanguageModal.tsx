import React from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../data/languagesData';
import { X, Check } from 'lucide-react';

export const LanguageModal: React.FC = () => {
  const { isLanguageModalOpen, setLanguageModalOpen, currentLanguage, setLanguage, showToast } = useApp();

  if (!isLanguageModalOpen) return null;

  const handleSelectLanguage = (langCode: string) => {
    setLanguage(langCode);
    setLanguageModalOpen(false);
    const selected = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    showToast({
      title: 'Language Updated',
      message: `Interface & audio guides set to ${selected?.nativeName || langCode}.`,
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 shadow-xl">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-base text-[#172033]">
            Select Language (भाषा चुनें)
          </h2>
          <button
            onClick={() => setLanguageModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Languages List */}
        <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto p-0.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between transition-colors border ${
                  isSelected
                    ? 'bg-slate-100 border-[#12355B] text-[#12355B] font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <span className="text-xs block">{lang.flag} {lang.nativeName}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{lang.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#12355B]" />}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
