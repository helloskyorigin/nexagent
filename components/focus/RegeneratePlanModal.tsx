'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

export interface RegeneratePlanModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const RegeneratePlanModal: React.FC<RegeneratePlanModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Reviewing your schedule...',
    'Checking recent changes across Gmail, Calendar & Drive...',
    'Rebalancing priorities & focus blocks...',
    'Preparing an optimized plan...',
  ];

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 600);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, onComplete, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in" />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-6 z-10 animate-in zoom-in-95 duration-200 text-center">
        {/* Animated Glow Icon */}
        <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100/90 flex items-center justify-center text-indigo-600 mb-4 shadow-sm relative">
          <Sparkles className="h-6 w-6 animate-pulse" />
        </div>

        <h3 className="text-base font-semibold text-slate-900">Rebalancing Your Day</h3>
        <p className="text-xs text-slate-600 mt-1 mb-5">
          Synthesizing real-time connected workspace context
        </p>

        {/* Steps List */}
        <div className="space-y-3 text-left">
          {steps.map((step, idx) => {
            const isFinished = idx < stepIndex;
            const isCurrent = idx === stepIndex;
            const isPending = idx > stepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'text-indigo-600 font-semibold scale-102 pl-1'
                    : isFinished
                    ? 'text-slate-700 font-medium'
                    : 'text-slate-600 opacity-60'
                }`}
              >
                {isFinished ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 text-indigo-600 animate-spin shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
