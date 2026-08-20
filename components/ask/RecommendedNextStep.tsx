'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface RecommendedNextStepProps {
  text?: string;
  actionLabel?: string;
  onPrepareResponse?: () => void;
  className?: string;
}

export const RecommendedNextStep: React.FC<RecommendedNextStepProps> = ({
  text = 'Resolve the deadline before the meeting.',
  actionLabel = 'Prepare response',
  onPrepareResponse,
  className,
}) => {
  return (
    <div className={cn('space-y-2 pt-1', className)}>
      {/* Label */}
      <span className="text-[10.5px] font-bold text-indigo-500 uppercase tracking-wider block pl-1">
        RECOMMENDED NEXT STEP
      </span>

      {/* Surface Card */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-indigo-50/80 rounded-2xl border border-indigo-100/90 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-6 w-6 rounded-full bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles className="h-3.5 w-3.5 fill-indigo-600/30" />
          </div>
          <p className="text-[13px] sm:text-sm font-semibold text-slate-900 tracking-tight">
            {text}
          </p>
        </div>

        <button
          type="button"
          onClick={onPrepareResponse}
          className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-xs cursor-pointer shrink-0"
        >
          <span>{actionLabel.replace(' →', '')}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
