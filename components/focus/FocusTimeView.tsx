'use client';

import React from 'react';
import { Target, Sparkles, Clock, Calendar, ShieldCheck, Zap } from 'lucide-react';

export interface FocusTimeViewProps {
  onScheduleWindow: (windowText: string) => void;
}

export const FocusTimeView: React.FC<FocusTimeViewProps> = ({ onScheduleWindow }) => {
  const focusWindows = [
    {
      time: '9:00 AM – 11:00 AM',
      type: 'Peak Cognitive Energy',
      status: 'Recommended',
      description: 'Ideal for strategic doc reviews, pricing models, and system architecture.',
      score: '98% Focus Match',
    },
    {
      time: '1:30 PM – 3:00 PM',
      type: 'Execution Block',
      status: 'Available',
      description: 'Optimal for task execution, PR reviews, and detailed client follow-ups.',
      score: '84% Focus Match',
    },
    {
      time: '4:30 PM – 5:30 PM',
      type: 'Wrap-up & Alignment',
      status: 'Available',
      description: 'Best for async team communications, milestone reviews, and inbox clearing.',
      score: '72% Focus Match',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recommended Deep Work Windows</h3>
            <p className="text-xs text-slate-600">
              Calculated using meeting density and historical focus patterns
            </p>
          </div>
          <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Target className="h-4 w-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {focusWindows.map((win, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-indigo-100/80 bg-indigo-50/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100/70 text-indigo-700">
                    {win.type}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">{win.score}</span>
                </div>
                <div className="text-sm font-bold text-slate-900">{win.time}</div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{win.description}</p>
              </div>

              <button
                onClick={() => onScheduleWindow(win.time)}
                className="mt-4 w-full py-2 px-3 rounded-lg bg-white hover:bg-indigo-50 border border-indigo-200 text-xs font-medium text-indigo-700 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Reserve Focus Block</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
