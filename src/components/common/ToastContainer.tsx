import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-cyan-500 shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/80';
            case 'warning':
              return 'border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/80';
            case 'error':
              return 'border-rose-500/40 bg-rose-50/95 dark:bg-rose-950/90';
            default:
              return 'border-cyan-500/30 bg-cyan-50/90 dark:bg-cyan-950/80';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 flex items-start gap-3 animate-slide-up ${getBorderColor()}`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{toast.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 -mr-1 -mt-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
