'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { PluginConnectionStatus } from '../../services/integrations/types';

interface PluginStatusBadgeProps {
  status: PluginConnectionStatus;
  className?: string;
  customLabel?: string;
}

export const PluginStatusBadge: React.FC<PluginStatusBadgeProps> = ({
  status,
  className = '',
  customLabel,
}) => {
  switch (status) {
    case 'CONNECTED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 ${className}`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{customLabel || 'Connected'}</span>
        </span>
      );

    case 'CONNECTING':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 ${className}`}
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>{customLabel || 'Connecting...'}</span>
        </span>
      );

    case 'NEEDS_REAUTH':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 ${className}`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span>{customLabel || 'Waiting'}</span>
        </span>
      );

    case 'ERROR':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 ${className}`}
        >
          <span className="h-2 w-2 rounded-full bg-rose-400" />
          <span>{customLabel || 'Attention required'}</span>
        </span>
      );

    case 'UNAVAILABLE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 ${className}`}
        >
          <span className="h-2 w-2 rounded-full bg-slate-600" />
          <span>{customLabel || 'Unavailable'}</span>
        </span>
      );

    case 'DISABLED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 ${className}`}
        >
          <span className="h-2 w-2 rounded-full bg-slate-600" />
          <span>{customLabel || 'Disabled'}</span>
        </span>
      );

    case 'NOT_CONNECTED':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 ${className}`}
        >
          <span className="h-2 w-2 rounded-full bg-slate-600" />
          <span>{customLabel || 'Not Connected'}</span>
        </span>
      );
  }
};
