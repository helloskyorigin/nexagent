'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface AISummaryBannerProps {
  onViewInsights: () => void;
  onFocusGoal?: (goalId: string) => void;
}

export const AISummaryBanner: React.FC<AISummaryBannerProps> = ({
  onViewInsights,
  onFocusGoal,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-indigo-100/90 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.06)] p-4 sm:p-5 transition-all group hover:border-indigo-200">
      {/* Soft background ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/60 via-white to-purple-50/40 pointer-events-none" />

      {/* Subtle orbital background line */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none opacity-40">
        <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none" fill="none">
          <path
            d="M0,40 Q100,10 200,40"
            stroke="#6366F1"
            strokeWidth="0.75"
            strokeDasharray="4 4"
          />
          <circle cx="120" cy="28" r="2.5" fill="#6366F1" opacity="0.6" />
        </svg>
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: AI Sparkle icon + Text */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-indigo-50/90 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 fill-indigo-500/10 text-indigo-600" />
          </div>

          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1.5">
              <span>AI Summary</span>
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
              You&apos;re on track to achieve <span className="text-indigo-600 font-bold">3 of your 6 goals</span> this quarter.
            </h2>
            <p className="text-xs text-slate-600">
              Focus on{' '}
              <button
                onClick={() => onFocusGoal?.('goal-1')}
                className="font-semibold text-slate-900 hover:text-indigo-600 underline decoration-indigo-300 underline-offset-2 transition-colors cursor-pointer"
              >
                &lsquo;Project Alpha Launch&rsquo;
              </button>{' '}
              — it needs attention.
            </p>
          </div>
        </div>

        {/* Right Side: View insights button */}
        <button
          onClick={onViewInsights}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/80 px-3.5 py-2 rounded-xl border border-indigo-100/60 transition-all self-start sm:self-auto group/btn cursor-pointer active:scale-95 shrink-0 bg-white/80 shadow-2xs"
        >
          <span>View insights</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
