'use client';

import React from 'react';
import { Trash2, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface DangerZoneProps {
  onDeleteAllData: () => void;
  className?: string;
}

export const DangerZone: React.FC<DangerZoneProps> = ({
  onDeleteAllData,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] transition-all space-y-3',
        className
      )}
    >
      <div className="space-y-0.5">
        <h3 className="text-sm sm:text-base font-bold text-red-600 dark:text-red-400 tracking-tight">
          Danger Zone
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Irreversible and permanent actions.
        </p>
      </div>

      <div className="pt-1">
        <button
          onClick={onDeleteAllData}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-red-50/60 dark:bg-red-950/30 hover:bg-red-100/80 dark:hover:bg-red-900/40 border border-red-200/60 dark:border-red-900/40 transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
            <span className="text-xs font-bold text-red-600 dark:text-red-400">
              Delete all data
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-red-400 dark:text-red-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      </div>
    </div>
  );
};
