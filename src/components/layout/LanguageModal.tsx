import React from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../data/languagesData';
import { Globe, X, Check } from 'lucide-react';

export const LanguageModal: React.FC = () => {
  const { isLanguageModalOpen, setLanguageModalOpen, currentLanguage, setLanguage, showToast } = useApp();

  if (!isLanguageModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-safar-saffron-500/10 dark:bg-safar-saffron-500/20 text-safar-saffron-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">Select Language (भाषा चुनें)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Audio guides and interface adapt instantly</p>
            </div>
          </div>
          <button
            onClick={() => setLanguageModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid of Languages */}
        <div className="p-6 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setLanguageModalOpen(false);
                  showToast({
                    title: 'Language Updated',
                    message: `Language switched to ${lang.nativeName} (${lang.name}).`,
                    type: 'success',
                  });
                }}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${
                  isSelected
                    ? 'border-safar-saffron-500 bg-safar-saffron-50/60 dark:bg-safar-saffron-950/30 ring-2 ring-safar-saffron-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{lang.nativeName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{lang.name}</div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-safar-saffron-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official Indian National & Regional Languages powered by AI Translation
          </p>
        </div>
      </div>
    </div>
  );
};
