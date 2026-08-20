'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, Link2, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from './Badge';
import { Button } from './Button';

export type ConnectorHealthState = 'connected' | 'degraded' | 'disconnected' | 'syncing';

export interface ConnectorStatusProps {
  name: string;
  type: string;
  status: ConnectorHealthState;
  lastSyncedAt?: string;
  errorMessage?: string;
  onSync?: () => void;
  onReconnect?: () => void;
  className?: string;
}

export const ConnectorStatus: React.FC<ConnectorStatusProps> = ({
  name,
  type,
  status,
  lastSyncedAt,
  errorMessage,
  onSync,
  onReconnect,
  className,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="success" dot size="sm">
            Connected
          </Badge>
        );
      case 'degraded':
        return (
          <Badge variant="warning" dot size="sm">
            Degraded
          </Badge>
        );
      case 'syncing':
        return (
          <Badge variant="info" size="sm">
            <RefreshCw className="h-3 w-3 animate-spin mr-1" />
            Syncing...
          </Badge>
        );
      case 'disconnected':
      default:
        return (
          <Badge variant="danger" dot size="sm">
            Disconnected
          </Badge>
        );
    }
  };

  return (
    <div className={cn('p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs shrink-0">
            <Link2 className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-2">
              {name}
              <span className="text-[10px] font-normal text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                {type}
              </span>
            </h4>
            {lastSyncedAt && <p className="text-[11px] text-slate-400 mt-0.5">Last sync: {lastSyncedAt}</p>}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/60 text-amber-800 text-[11px] flex items-start gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
        {status === 'disconnected' ? (
          <Button variant="primary" size="sm" onClick={onReconnect} leftIcon={<ExternalLink className="h-3.5 w-3.5" />}>
            Reconnect
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={onSync} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
            Sync Now
          </Button>
        )}
      </div>
    </div>
  );
};
