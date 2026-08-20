'use client';

import React from 'react';
import { Sun, Check, Info } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface AppearanceTabProps {
  className?: string;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ className }) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Appearance
        </h2>
        <p className="text-xs text-slate-500 font-normal">
          Display theme and visual options.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-6 text-xs">
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-900">Theme Mode</label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Selected Light Theme Card */}
            <div className="p-4 rounded-2xl border-2 border-blue-600 bg-blue-50/60 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-white border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs">
                  <Sun className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-slate-900 font-bold">Light Mode</div>
                  <div className="text-[11px] text-slate-500 font-normal">Optimized high contrast UI</div>
                </div>
              </div>
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Check className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Informational Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
          <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
            Nexorbit 2.0 is designed exclusively in an ultra-clean Light Mode palette for optimal legibility, professional elegance, and focus.
          </p>
        </div>
      </div>
    </div>
  );
};
