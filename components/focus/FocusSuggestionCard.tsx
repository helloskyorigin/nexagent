'use client';

import React from 'react';
import { Target, Calendar } from 'lucide-react';

export interface FocusSuggestionCardProps {
  timeWindow?: string;
  description?: string;
  onScheduleFocusTime?: () => void;
}

export const FocusSuggestionCard: React.FC<FocusSuggestionCardProps> = ({
  timeWindow = '2:00 PM – 4:00 PM',
  description = 'Deep work time for important tasks.',
  onScheduleFocusTime,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <Target className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
          Focus Time
        </h3>
      </div>

      {/* Content */}
      <div className="space-y-1 mb-4">
        <div className="text-xs text-slate-500 font-medium">
          Recommended Focus Block
        </div>
        <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {timeWindow}
        </div>
        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onScheduleFocusTime}
        className="w-full py-2.5 px-3 rounded-xl bg-indigo-50/60 hover:bg-indigo-100/70 border border-indigo-100 text-xs font-semibold text-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
      >
        <Calendar className="h-3.5 w-3.5 text-indigo-600" />
        <span>Block Focus Time</span>
      </button>
    </div>
  );
};
