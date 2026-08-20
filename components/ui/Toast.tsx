'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto p-4 rounded-xl bg-white border shadow-lg flex items-start gap-3 transition-all duration-200 animate-slideUp',
              toast.type === 'success' && 'border-emerald-200 text-slate-900',
              toast.type === 'error' && 'border-red-200 text-slate-900',
              toast.type === 'info' && 'border-indigo-200 text-slate-900'
            )}
          >
            {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <h5 className="text-xs font-semibold">{toast.title}</h5>
              {toast.description && <p className="text-xs text-slate-500 mt-0.5">{toast.description}</p>}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
