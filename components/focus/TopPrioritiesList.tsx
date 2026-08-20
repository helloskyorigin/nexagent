'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PriorityItem {
  id: string;
  title: string;
  level: 'High' | 'Medium' | 'Important';
  dotColor: 'red' | 'orange' | 'amber';
}

export interface TopPrioritiesListProps {
  onSelectPriority: (id: string) => void;
  selectedId?: string | null;
}

export const TopPrioritiesList: React.FC<TopPrioritiesListProps> = ({
  onSelectPriority,
  selectedId,
}) => {
  const priorities: PriorityItem[] = [
    {
      id: 'plan-2',
      title: 'Review client feedback',
      level: 'High',
      dotColor: 'red',
    },
    {
      id: 'plan-3',
      title: 'Proposal v2 final review',
      level: 'High',
      dotColor: 'orange',
    },
    {
      id: 'plan-5',
      title: 'Prepare pricing strategy',
      level: 'Medium',
      dotColor: 'amber',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
          <span>Top Priorities</span>
        </h3>
        <Sparkles className="h-4 w-4 text-indigo-500/80" />
      </div>

      {/* Priority Rows */}
      <div className="space-y-2.5">
        {priorities.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPriority(item.id)}
              className={cn(
                'w-full flex items-center justify-between gap-2 p-2 rounded-xl text-left transition-colors cursor-pointer group',
                isSelected
                  ? 'bg-indigo-50/80 ring-1 ring-indigo-300'
                  : 'hover:bg-slate-50'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Dot */}
                <div
                  className={cn(
                    'h-2 w-2 rounded-full shrink-0',
                    item.dotColor === 'red' && 'bg-rose-500',
                    item.dotColor === 'orange' && 'bg-amber-500',
                    item.dotColor === 'amber' && 'bg-amber-400'
                  )}
                />
                <span className="text-xs sm:text-sm font-medium text-slate-800 truncate group-hover:text-slate-900">
                  {item.title}
                </span>
              </div>

              {/* Priority badge */}
              <span
                className={cn(
                  'text-xs font-semibold shrink-0',
                  item.level === 'High' ? 'text-amber-600' : 'text-amber-500'
                )}
              >
                {item.level}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
