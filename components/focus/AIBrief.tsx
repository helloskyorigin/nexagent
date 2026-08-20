'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const PlanSummaryCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
          <Sparkles className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Here’s your plan for today
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Based on your schedule, deadlines, messages and connected apps, Nexorbit prioritized what matters.
          </p>
        </div>
      </div>
    </div>
  );
};

