'use client';

import React from 'react';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import { QUICK_SUGGESTIONS } from './mockData';
import { CommandMode } from './types';
import { cn } from '../../lib/utils';

export interface QuickSuggestionsProps {
  onSelectSuggestion: (query: string, mode?: CommandMode) => void;
  className?: string;
}

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({
  onSelectSuggestion,
  className,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'chart':
        return <TrendingUp className="h-3.5 w-3.5 text-blue-500" />;
      case 'calendar':
        return <Calendar className="h-3.5 w-3.5 text-blue-500" />;
      case 'target':
        return <Target className="h-3.5 w-3.5 text-blue-500" />;
      default:
        return <TrendingUp className="h-3.5 w-3.5 text-blue-500" />;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {QUICK_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            onClick={() => onSelectSuggestion(suggestion.query, 'auto')}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-sm text-slate-700 hover:text-slate-950 text-[13px] font-medium transition-all duration-150 cursor-pointer shadow-3xs group text-left sm:text-center"
          >
            <span className="shrink-0 transition-transform group-hover:scale-110">
              {getIcon(suggestion.icon)}
            </span>
            <span className="truncate">{suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
