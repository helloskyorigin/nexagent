'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { TaskStatus } from '../../services/agent/storage';

export type ExtendedTaskStatus = TaskStatus | 'draft' | 'ready';

export interface StatusBadgeProps {
  status: ExtendedTaskStatus;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showDot = true,
}) => {
  const getStyles = () => {
    switch (status) {
      case 'running':
        return {
          bg: 'bg-blue-600/10 border-blue-500/30 text-blue-400',
          dot: 'bg-blue-400 animate-pulse',
          label: 'Running',
        };
      case 'ready':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400 animate-pulse',
          label: 'Ready',
        };
      case 'paused':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400',
          label: 'Paused',
        };
      case 'waiting_approval':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          dot: 'bg-purple-400 animate-ping',
          label: 'Waiting for approval',
        };
      case 'completed':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          dot: 'bg-emerald-400',
          label: 'Completed',
        };
      case 'failed':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-400',
          dot: 'bg-red-400',
          label: 'Failed',
        };
      case 'scheduled':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
          dot: 'bg-indigo-400',
          label: 'Scheduled',
        };
      case 'draft':
      default:
        return {
          bg: 'bg-slate-800/80 border-slate-700/60 text-slate-400',
          dot: 'bg-slate-500',
          label: 'Draft',
        };
    }
  };

  const style = getStyles();

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide',
        style.bg,
        className
      )}
    >
      {showDot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', style.dot)} />}
      <span>{style.label}</span>
    </span>
  );
};
