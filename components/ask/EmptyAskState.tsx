'use client';

import React from 'react';
import { Brain, Search, GitMerge, Zap, Sparkles } from 'lucide-react';
import { EMPTY_STATE_SUGGESTIONS } from './mockData';
import { cn } from '../../lib/utils';

export interface EmptyAskStateProps {
  onSelectSuggestion: (prompt: string) => void;
  className?: string;
}

export const EmptyAskState: React.FC<EmptyAskStateProps> = ({
  onSelectSuggestion,
  className,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Understand':
        return <Brain className="h-4 w-4 text-indigo-600" />;
      case 'Find':
        return <Search className="h-4 w-4 text-sky-600" />;
      case 'Connect':
        return <GitMerge className="h-4 w-4 text-violet-600" />;
      case 'Act':
        return <Zap className="h-4 w-4 text-amber-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-indigo-600" />;
    }
  };

  return (
    <div className={cn('py-8 sm:py-12 space-y-8 max-w-2xl mx-auto text-center select-none animate-fadeIn', className)}>
      {/* Central Celestial Icon / Subtle Orbit */}
      <div className="relative inline-flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-900 via-indigo-700 to-violet-500 p-[2px] shadow-[0_0_25px_rgba(99,102,241,0.25)] flex items-center justify-center">
          <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-indigo-200 animate-spin" style={{ animationDuration: '16s' }}>
              <circle cx="12" cy="12" r="3" fill="#ffffff" />
              <ellipse cx="12" cy="12" rx="9" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(-30 12 12)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Heading & Subtitle */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 font-sans">
          What would you like to understand?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Ask about your emails, files, meetings, projects or goals.
        </p>
      </div>

      {/* Suggestion Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {EMPTY_STATE_SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSuggestion(item.prompt)}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:bg-slate-50/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all flex items-start gap-3 text-left group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
              {getCategoryIcon(item.category)}
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                {item.category}
              </span>
              <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                {item.label}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
