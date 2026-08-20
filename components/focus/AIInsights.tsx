'use client';

import React from 'react';
import { Sparkles, AlertCircle, Mail, CheckCircle2 } from 'lucide-react';

export const AIInsights: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3.5">
        <Sparkles className="h-4 w-4 text-blue-500" />
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
          Insights
        </h3>
      </div>

      {/* Insights list */}
      <div className="space-y-3 text-xs">
        {/* Insight 1 */}
        <div className="flex items-start gap-3">
          <div className="h-7 w-7 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 mt-0.5">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">
              You have 1 deadline conflict
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Review to avoid delays.
            </div>
          </div>
        </div>

        {/* Insight 2 */}
        <div className="flex items-start gap-3">
          <div className="h-7 w-7 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
            <Mail className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">
              2 important follow-ups pending
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Replies expected soon.
            </div>
          </div>
        </div>

        {/* Insight 3 */}
        <div className="flex items-start gap-3">
          <div className="h-7 w-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">
              Your day is well balanced
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Keep going!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
