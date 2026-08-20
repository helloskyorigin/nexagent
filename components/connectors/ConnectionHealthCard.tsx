'use client';

import React from 'react';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ConnectionHealthCardProps {
  onViewStatus?: () => void;
  className?: string;
}

export const ConnectionHealthCard: React.FC<ConnectionHealthCardProps> = ({
  onViewStatus,
  className,
}) => {
  return (
    <div className={cn('p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase font-sans">
          Connection Health
        </h3>
        <button
          onClick={onViewStatus}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-0.5 transition-colors cursor-pointer"
        >
          <span>View status</span>
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/80">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
        <div>
          <div className="text-xs font-bold text-emerald-950 leading-none">
            All systems operational
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            Last checked just now
          </div>
        </div>
      </div>
    </div>
  );
};

