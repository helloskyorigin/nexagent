'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FollowUpSuggestionsProps {
  onSelectFollowUp: (prompt: string) => void;
  className?: string;
}

export const FollowUpSuggestions: React.FC<FollowUpSuggestionsProps> = ({
  onSelectFollowUp,
  className,
}) => {
  const suggestions = [
    { label: 'Show the sources', prompt: 'Show me the exact source details for this answer.' },
    { label: "What’s the biggest risk?", prompt: 'What is the biggest potential risk identified here?' },
    { label: 'Summarize this', prompt: 'Give me a 2-sentence summary of these insights.' },
  ];

  return (
    <div className={cn('pt-2 space-y-2', className)}>
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block pl-1">
        Suggested follow-ups
      </span>
      <div className="flex flex-wrap gap-x-4 gap-y-2 pl-1">
        {suggestions.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelectFollowUp(item.prompt)}
            className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer group"
          >
            <span>{item.label}</span>
            <span className="text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5 duration-150">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

