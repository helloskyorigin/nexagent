'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface StorageUsageCardProps {
  usedGB?: number;
  totalGB?: number;
  onViewDetails: () => void;
  className?: string;
}

export const StorageUsageCard: React.FC<StorageUsageCardProps> = ({
  usedGB = 6.8,
  totalGB = 10,
  onViewDetails,
  className,
}) => {
  const percentage = Math.round((usedGB / totalGB) * 100);

  return (
    <div
      className={cn(
        'p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] transition-all space-y-4',
        className
      )}
    >
      <div className="space-y-0.5">
        <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
          Storage &amp; Usage
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          You are using {percentage}% of your storage.
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2 pt-1">
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 transition-all duration-500 shadow-xs"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Quantities */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
          <span>
            {usedGB} GB <span className="text-slate-400 dark:text-slate-500 font-normal">/ {totalGB} GB</span>
          </span>
          <span className="text-indigo-600 dark:text-indigo-400">{percentage}%</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={onViewDetails}
          className="w-full flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-1 transition-colors cursor-pointer group"
        >
          <span>View Usage Details</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
