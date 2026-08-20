'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface MemoryInsightsBannerProps {
  onViewInsights: () => void;
  totalMemories?: number;
}

export const MemoryInsightsBanner: React.FC<MemoryInsightsBannerProps> = ({
  onViewInsights,
  totalMemories = 1248,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
      <div className="flex items-center gap-3.5">
        {/* Soft Lavender Icon Box */}
        <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs">
          <Sparkles className="h-5 w-5 fill-indigo-500/15 text-indigo-600" />
        </div>

        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Memory Insights
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            You have <strong className="text-slate-800 font-semibold">{totalMemories.toLocaleString()} memories</strong>. Your context helps Nexorbit give you personalized answers.
          </p>
        </div>
      </div>

      <button
        onClick={onViewInsights}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors shrink-0 cursor-pointer self-start sm:self-center"
      >
        <span>View insights</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
