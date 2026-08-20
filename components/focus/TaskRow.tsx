'use client';

import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { DailyPlanItem } from './types';
import { SourceIcon } from '../changes/SourceIcon';
import { cn } from '../../lib/utils';

export interface TaskRowProps {
  item: DailyPlanItem;
  onActionClick: (item: DailyPlanItem) => void;
  onCompleteToggle: (id: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  item,
  onActionClick,
  onCompleteToggle,
}) => {
  const getPriorityBadgeStyles = () => {
    switch (item.priority) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200/60';
    }
  };

  return (
    <div
      id={`plan-item-${item.id}`}
      onClick={() => onActionClick(item)}
      className={cn(
        'group flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-2xl hover:border-slate-300 hover:shadow-2xs transition-all duration-150 cursor-pointer select-none',
        item.isCompleted && 'opacity-60 bg-slate-50'
      )}
    >
      {/* Left section: Checkbox + Time + Source Icon + Title & Short Context */}
      <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompleteToggle(item.id);
          }}
          className={cn(
            'h-5 w-5 rounded-md border flex items-center justify-center transition-colors shrink-0 cursor-pointer',
            item.isCompleted
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-slate-300 hover:border-slate-400 bg-white text-transparent'
          )}
          title={item.isCompleted ? 'Mark as active' : 'Mark as completed'}
        >
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </button>

        {/* Time Badge */}
        <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold shrink-0">
          {item.time}
        </div>

        {/* Source Icon Box */}
        <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
          <SourceIcon type={item.sourceIcon || item.source} className="h-4 w-4" />
        </div>

        {/* Title & Short Context */}
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              'text-xs sm:text-sm font-bold text-slate-900 truncate tracking-tight',
              item.isCompleted && 'line-through text-slate-400 font-normal'
            )}
          >
            {item.title}
          </div>
          <div className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5 font-medium">
            {item.subtitle}
          </div>
        </div>
      </div>

      {/* Right section: Priority Badge + Arrow Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize', getPriorityBadgeStyles())}>
          {item.priority === 'high' ? 'High' : item.priority === 'medium' ? 'Medium' : 'Low'}
        </span>

        <div className="h-8 w-8 rounded-full bg-slate-50 group-hover:bg-indigo-50 border border-slate-200/60 group-hover:border-indigo-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};

