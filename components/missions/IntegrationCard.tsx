'use client';

import React from 'react';
import { ServiceIntegrationItem } from './ConnectModal';
import { cn } from '../../lib/utils';

export interface IntegrationCardProps {
  item: ServiceIntegrationItem;
  onConnect: (service: ServiceIntegrationItem) => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  item,
  onConnect,
}) => {
  const Icon = item.icon;
  const isConnected = item.status === 'connected';
  const needsAttention = item.status === 'needs_attention';

  return (
    <div className="bg-[#15181D] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all group">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 rounded-xl bg-[#0D0F12] border border-slate-800 flex items-center justify-center text-blue-400">
            <Icon className="h-4 w-4" />
          </div>
          <span
            className={cn(
              'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border',
              isConnected
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : needsAttention
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'bg-slate-800/80 border-slate-700/60 text-slate-400'
            )}
          >
            {isConnected ? 'Connected' : needsAttention ? 'Needs attention' : 'Not connected'}
          </span>
        </div>

        <div>
          <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
            {item.name}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
            {item.description}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onConnect(item)}
        className={cn(
          'w-full py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
          isConnected
            ? 'bg-[#0D0F12] hover:bg-[#121520] text-slate-300 border border-slate-800'
            : needsAttention
            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
            : 'bg-blue-600 hover:bg-blue-500 text-white'
        )}
      >
        {isConnected ? 'Connected' : needsAttention ? 'Fix Connection' : 'Connect'}
      </button>
    </div>
  );
};
