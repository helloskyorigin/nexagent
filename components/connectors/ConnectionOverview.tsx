'use client';

import React from 'react';
import { ConnectorItem } from './types';
import { Plus, CheckCircle2, AlertCircle, CircleOff } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ConnectionOverviewProps {
  connectors: ConnectorItem[];
  onConnectNewApp?: () => void;
  className?: string;
}

export const ConnectionOverview: React.FC<ConnectionOverviewProps> = ({
  connectors,
  onConnectNewApp,
  className,
}) => {
  const connectedCount = connectors.filter((c) => c.status === 'connected' || c.status === 'up_to_date').length;
  const needsAttentionCount = connectors.filter((c) => c.status === 'needs_attention' || c.status === 'error' || c.status === 'connection_failed').length;
  const disconnectedCount = connectors.filter((c) => c.status === 'not_connected').length;

  return (
    <div
      className={cn(
        'p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 min-w-0">
        <div>
          <div className="text-base font-bold text-slate-900 font-sans tracking-tight">
            {connectedCount} {connectedCount === 1 ? 'app' : 'apps'} connected
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Your digital world is connected
          </div>
        </div>

        {/* Small Status Indicators */}
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600 sm:border-l sm:border-slate-200/80 sm:pl-6 pt-2 sm:pt-0 border-t border-slate-100 sm:border-t-0">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span>{connectedCount} Connected</span>
          </div>

          {needsAttentionCount > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
              <span>{needsAttentionCount} Needs attention</span>
            </div>
          )}

          {disconnectedCount > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-300 shrink-0" />
              <span>{disconnectedCount} Disconnected</span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onConnectNewApp}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors shrink-0 cursor-pointer self-start sm:self-center"
      >
        <Plus className="h-3.5 w-3.5 text-slate-500" />
        <span>Connect New App</span>
      </button>
    </div>
  );
};

