'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export type StatusState = 'online' | 'busy' | 'offline' | 'active' | 'error' | 'warning' | 'degraded' | 'syncing';

export interface StatusIndicatorProps {
  status?: StatusState;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  text?: string;
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status = 'active',
  size = 'md',
  label,
  text,
  pulse = false,
  className,
}) => {
  const displayText = label || text;

  const colors: Record<StatusState, string> = {
    online: 'bg-emerald-500',
    active: 'bg-indigo-500',
    busy: 'bg-amber-500',
    degraded: 'bg-amber-500',
    syncing: 'bg-sky-500 animate-pulse',
    offline: 'bg-slate-400',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
  };

  const sizes: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
  };

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex items-center justify-center">
        {(pulse || status === 'syncing') && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
              colors[status]
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full', colors[status], sizes[size])} />
      </span>
      {displayText && <span className="text-xs font-medium text-slate-700">{displayText}</span>}
    </div>
  );
};
