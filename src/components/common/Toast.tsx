import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let bg = 'bg-stone-900 border-stone-800 text-white';
          let icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;

          if (toast.type === 'error') {
            bg = 'bg-red-950 border-red-800 text-red-100';
            icon = <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />;
          } else if (toast.type === 'warning') {
            bg = 'bg-amber-950 border-amber-800 text-amber-100';
            icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
          } else if (toast.type === 'info') {
            bg = 'bg-stone-900 border-[#C5A059] text-white';
            icon = <Info className="w-4 h-4 text-[#C5A059] shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg border shadow-xl text-xs transition-all animate-in slide-in-from-bottom-2 ${bg}`}
            >
              <div className="flex items-center gap-2.5">
                {icon}
                <span className="font-medium leading-tight">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
