'use client';

import React from 'react';
import { PluginSummaryStats } from '../../services/integrations/types';
import { PluginPlugIcon } from './PluginIcons';

interface PluginSummaryProps {
  stats: PluginSummaryStats;
  loading?: boolean;
}

export const PluginSummary: React.FC<PluginSummaryProps> = ({ stats, loading = false }) => {
  return (
    <div className="w-full bg-[#121520]/80 border border-white/[0.06] rounded-2xl p-4.5 sm:p-5 shadow-2xs backdrop-blur-xs">
      <div className="flex flex-col md:flex-row md:items-center gap-5 sm:gap-6">
        {/* Plug Icon Container */}
        <div className="hidden lg:flex items-center justify-center h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex-shrink-0 shadow-inner">
          <PluginPlugIcon className="h-6 w-6 stroke-[2]" />
        </div>

        {/* Stat Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 flex-1 divide-y-0 sm:divide-x sm:divide-white/[0.06]">
          {/* 1. Connected */}
          <div className="flex flex-col justify-center sm:pr-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Connected
            </span>
            {loading ? (
              <div className="h-7 w-16 bg-white/[0.05] animate-pulse rounded-md mt-0.5" />
            ) : (
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {stats.connected}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  / {stats.total}
                </span>
              </div>
            )}
            <span className="text-[11px] text-slate-500 mt-0.5">
              Workspace connections
            </span>
          </div>

          {/* 2. Active */}
          <div className="flex flex-col justify-center sm:px-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Active
            </span>
            {loading ? (
              <div className="h-7 w-12 bg-white/[0.05] animate-pulse rounded-md mt-0.5" />
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="text-2xl font-bold text-white tracking-tight">
                  {stats.active}
                </span>
              </div>
            )}
            <span className="text-[11px] text-slate-500 mt-0.5">
              Ready for Agent tasks
            </span>
          </div>

          {/* 3. Waiting / Awaiting Approval */}
          <div className="flex flex-col justify-center sm:px-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Needs Action
            </span>
            {loading ? (
              <div className="h-7 w-12 bg-white/[0.05] animate-pulse rounded-md mt-0.5" />
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                <span className="text-2xl font-bold text-white tracking-tight">
                  {stats.waiting}
                </span>
              </div>
            )}
            <span className="text-[11px] text-slate-500 mt-0.5">
              Awaiting auth or review
            </span>
          </div>

          {/* 4. Available to Add */}
          <div className="flex flex-col justify-center sm:pl-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Available
            </span>
            {loading ? (
              <div className="h-7 w-12 bg-white/[0.05] animate-pulse rounded-md mt-0.5" />
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-slate-600" />
                <span className="text-2xl font-bold text-white tracking-tight">
                  {stats.total - stats.connected}
                </span>
              </div>
            )}
            <span className="text-[11px] text-slate-500 mt-0.5">
              Integrations ready to add
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
