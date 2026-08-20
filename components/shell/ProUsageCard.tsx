'use client';

import React from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface ProUsageCardProps {
  className?: string;
  used?: number;
  total?: number;
}

export const ProUsageCard: React.FC<ProUsageCardProps> = ({
  className,
  used = 1250,
  total = 15000,
}) => {
  const { addToast } = useToast();
  const percentage = Math.min(100, Math.round((used / total) * 100));

  const handleUpgradeClick = () => {
    addToast({
      type: 'info',
      title: 'Upgrade Plan',
      description: 'Billing and payment setup will be enabled in a later build phase.',
    });
  };

  return (
    <div
      className={cn(
        'p-3.5 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col gap-2.5 border border-slate-800',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Zap className="h-3.5 w-3.5 fill-indigo-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-100 tracking-tight block leading-tight">
              Nexorbit Pro
            </span>
            <span className="text-[10px] text-slate-400 block">Monthly allocation</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-300">
          <span>{used.toLocaleString()} / {total.toLocaleString()} credits</span>
          <span className="text-indigo-300 font-semibold">{percentage}%</span>
        </div>
        <ProgressBar value={percentage} size="sm" variant="indigo" />
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={handleUpgradeClick}
        leftIcon={<Sparkles className="h-3.5 w-3.5 text-indigo-500" />}
        className="w-full h-7 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/80 mt-0.5"
      >
        Upgrade
      </Button>
    </div>
  );
};
