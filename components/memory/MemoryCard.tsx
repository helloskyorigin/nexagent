'use client';

import React from 'react';
import {
  Calendar,
  Users,
  Heart,
  BookOpen,
  Scale,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { MemoryItem, MemoryCategory } from './types';
import { MemorySourceIcon } from './MemorySourceIcon';
import { cn } from '../../lib/utils';

export interface MemoryCardProps {
  memory: MemoryItem;
  isSelected?: boolean;
  onClick: (memory: MemoryItem) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  isSelected,
  onClick,
}) => {
  const getCategoryStyles = (category: MemoryCategory) => {
    switch (category) {
      case 'Projects':
        return {
          iconBox: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
          badge: 'bg-indigo-50 text-indigo-700 border border-indigo-100/80',
          icon: Calendar,
        };
      case 'People':
        return {
          iconBox: 'bg-purple-50 text-purple-700 border border-purple-100',
          badge: 'bg-purple-50 text-purple-700 border border-purple-100/80',
          icon: Users,
        };
      case 'Preferences':
        return {
          iconBox: 'bg-rose-50 text-rose-700 border border-rose-100',
          badge: 'bg-rose-50 text-rose-700 border border-rose-100/80',
          icon: Heart,
        };
      case 'Knowledge':
        return {
          iconBox: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
          badge: 'bg-emerald-50 text-emerald-700 border border-emerald-100/80',
          icon: BookOpen,
        };
      case 'Decisions':
        return {
          iconBox: 'bg-amber-50 text-amber-700 border border-amber-100',
          badge: 'bg-amber-50 text-amber-700 border border-amber-100/80',
          icon: Scale,
        };
      default:
        return {
          iconBox: 'bg-slate-100 text-slate-700 border border-slate-200',
          badge: 'bg-slate-100 text-slate-700 border border-slate-200/80',
          icon: FileText,
        };
    }
  };

  const style = getCategoryStyles(memory.category);
  const IconComponent = style.icon;

  return (
    <div
      id={`memory-row-${memory.id}`}
      onClick={() => onClick(memory)}
      className={cn(
        'group p-3.5 rounded-2xl bg-white border transition-all cursor-pointer text-left flex items-center justify-between gap-4 relative select-none',
        isSelected
          ? 'border-indigo-600 ring-1 ring-indigo-600/20 shadow-2xs bg-slate-50/50'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
      )}
    >
      {/* Left Icon & Main Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Category Icon */}
        <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', style.iconBox)}>
          <IconComponent className="h-4 w-4" />
        </div>

        {/* Title, Subtitle, Category Tag */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate tracking-tight">
              {memory.title}
            </h4>
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 uppercase tracking-wider', style.badge)}>
              {memory.category}
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
            {memory.description}
          </p>
        </div>
      </div>

      {/* Right Source, Date & Action Arrow */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-slate-700">
            <MemorySourceIcon type={memory.source.type} name={memory.source.name} className="h-3.5 w-3.5" />
            <span>{memory.source.name}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">
            {memory.timestamp}
          </div>
        </div>

        {/* Action Affordance */}
        <div className="h-8 w-8 rounded-full bg-slate-50 group-hover:bg-indigo-50 border border-slate-200/60 group-hover:border-indigo-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};

