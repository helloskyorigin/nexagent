'use client';

import React from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ProgressBar } from './ProgressBar';
import { Tooltip } from './Tooltip';

export interface CreditUsageIndicatorProps {
  used: number;
  total: number;
  tier?: string;
  showDetails?: boolean;
  className?: string;
}

export const CreditUsageIndicator: React.FC<CreditUsageIndicatorProps> = ({
  used,
  total,
  tier = 'Pro Plan',
  showDetails = true,
  className,
}) => {
  const percentage = Math.min(100, Math.round((used / total) * 100));
  const isHighUsage = percentage >= 85;

  return (
    <div className={cn('p-3.5 rounded-xl bg-slate-900 text-white shadow-sm flex flex-col gap-2.5', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 fill-indigo-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-100">{tier}</span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">AI Credits</span>
          </div>
        </div>
        <Tooltip content={`${used.toLocaleString()} used out of ${total.toLocaleString()} monthly allocation`}>
          <span className="text-xs font-mono font-medium text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60">
            {percentage}%
          </span>
        </Tooltip>
      </div>

      <ProgressBar
        value={percentage}
        size="sm"
        variant={isHighUsage ? 'danger' : 'indigo'}
      />

      {showDetails && (
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
          <span>{used.toLocaleString()} / {total.toLocaleString()} credits</span>
          {isHighUsage && (
            <span className="text-amber-400 flex items-center gap-1 font-medium">
              <AlertCircle className="h-3 w-3" /> Low balance
            </span>
          )}
        </div>
      )}
    </div>
  );
};
