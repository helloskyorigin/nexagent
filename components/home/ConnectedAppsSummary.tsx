'use client';

import React from 'react';
import { Mail, Calendar, HardDrive, BookOpen, GitBranch, Link2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { ConnectorId, CONNECTOR_DATA, getConnectorIcon } from '../shell/ConnectorModal';
import { cn } from '../../lib/utils';

export interface ConnectedAppsSummaryProps {
  onOpenConnector?: (id: ConnectorId) => void;
  className?: string;
}

export const ConnectedAppsSummary: React.FC<ConnectedAppsSummaryProps> = ({
  onOpenConnector,
  className,
}) => {
  const apps: ConnectorId[] = ['gmail', 'calendar', 'drive', 'notion', 'github'];

  return (
    <div className={cn('p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-indigo-600" />
          <h4 className="text-xs font-bold text-slate-900">Workspace Connectors</h4>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">3 of 5 Connected</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {apps.map((id) => {
          const info = CONNECTOR_DATA[id];
          return (
            <button
              key={id}
              onClick={() => onOpenConnector?.(id)}
              className={cn(
                'px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all duration-150',
                info.connected
                  ? 'bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/50'
                  : 'bg-slate-50/50 border-dashed border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
              )}
            >
              <span className={info.connected ? 'text-indigo-600' : 'text-slate-400'}>
                {getConnectorIcon(id, 'h-3.5 w-3.5')}
              </span>
              <span>{info.name}</span>
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  info.connected ? 'bg-emerald-500' : 'bg-slate-300'
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
