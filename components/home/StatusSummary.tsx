'use client';

import React from 'react';
import { AlertCircle, TrendingUp, Calendar, CheckSquare, ArrowRight } from 'lucide-react';
import { StatusSummaryBlock } from './types';
import { STATUS_SUMMARY_ITEMS } from './mockData';
import { cn } from '../../lib/utils';

export interface StatusSummaryProps {
  items?: StatusSummaryBlock[];
  onItemClick: (block: StatusSummaryBlock) => void;
  className?: string;
}

export const StatusSummary: React.FC<StatusSummaryProps> = ({
  items = STATUS_SUMMARY_ITEMS,
  onItemClick,
  className,
}) => {
  const renderIcon = (type: StatusSummaryBlock['iconType']) => {
    switch (type) {
      case 'attention':
        return (
          <div className="h-10 w-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-orange-500 stroke-[2.2]" />
          </div>
        );
      case 'changed':
        return (
          <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5 text-blue-600 stroke-[2.2]" />
          </div>
        );
      case 'upcoming':
        return (
          <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5 text-indigo-600 stroke-[2.2]" />
          </div>
        );
      case 'completed':
        return (
          <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <CheckSquare className="h-5 w-5 text-emerald-600 stroke-[2.2]" />
          </div>
        );
    }
  };

  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onItemClick(item)}
          className="bg-white rounded-3xl p-4 sm:p-4.5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-3.5 group"
        >
          {renderIcon(item.iconType)}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-950">
                {item.count}
              </span>
              <span className="text-[13px] font-semibold text-slate-700 truncate">
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11.5px] font-medium text-blue-600 group-hover:text-blue-700 transition-colors mt-0.5">
              <span>View details</span>
              <span className="text-xs transition-transform group-hover:translate-x-0.5">→</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
