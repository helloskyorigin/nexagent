'use client';

import React from 'react';
import { CheckCircle2, RefreshCw, AlertCircle, AlertTriangle, Circle, Loader2 } from 'lucide-react';
import { SyncState } from './types';
import { cn } from '../../lib/utils';

export interface ConnectorStatusProps {
  status: SyncState;
  customLabel?: string;
  className?: string;
}

export const ConnectorStatus: React.FC<ConnectorStatusProps> = ({
  status,
  customLabel,
  className,
}) => {
  switch (status) {
    case 'connected':
    case 'up_to_date':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-200/60',
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>{customLabel || 'Connected'}</span>
        </span>
      );

    case 'connecting':
    case 'syncing':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50/80 text-blue-700 border border-blue-200/60',
            className
          )}
        >
          <Loader2 className="h-3 w-3 text-blue-600 animate-spin shrink-0" />
          <span>{customLabel || (status === 'connecting' ? 'Connecting...' : 'Syncing...')}</span>
        </span>
      );

    case 'reconnecting':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50/80 text-amber-800 border border-amber-200/60',
            className
          )}
        >
          <RefreshCw className="h-3 w-3 text-amber-600 animate-spin shrink-0" />
          <span>{customLabel || 'Reconnecting...'}</span>
        </span>
      );

    case 'needs_attention':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50/80 text-amber-800 border border-amber-200/60',
            className
          )}
        >
          <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
          <span>{customLabel || 'Needs attention'}</span>
        </span>
      );

    case 'connection_failed':
    case 'error':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50/80 text-rose-700 border border-rose-200/60',
            className
          )}
        >
          <AlertCircle className="h-3 w-3 text-rose-600 shrink-0" />
          <span>{customLabel || 'Connection failed'}</span>
        </span>
      );

    case 'not_connected':
    default:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100/80 text-slate-500 border border-slate-200/60',
            className
          )}
        >
          <Circle className="h-1.5 w-1.5 fill-slate-300 text-slate-300 shrink-0" />
          <span>{customLabel || 'Not connected'}</span>
        </span>
      );
  }
};
