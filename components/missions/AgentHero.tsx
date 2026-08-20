'use client';

import React from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';

export interface AgentHeroProps {
  connectedCount: number;
  activeCount: number;
  approvalCount: number;
  completedCount: number;
  onConnectTools: () => void;
  onCreateTask: () => void;
}

export const AgentHero: React.FC<AgentHeroProps> = ({
  connectedCount,
  activeCount,
  approvalCount,
  completedCount,
  onConnectTools,
  onCreateTask,
}) => {
  return (
    <div className="relative bg-[#15181D] border border-slate-800 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-2xl">
      {/* Subtle Blue Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">
              ● Ready
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Nexorbit Agent
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-blue-400">
            One agent. Your connected workspace.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Connect the tools you use every day and let Nexorbit plan, execute, and complete work across them.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onConnectTools}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              Connect tools
            </button>
            <button
              type="button"
              onClick={onCreateTask}
              className="px-4 py-2 rounded-xl bg-[#0D0F12] hover:bg-[#121520] border border-slate-800 text-slate-300 text-xs font-medium transition-all cursor-pointer"
            >
              Create a task
            </button>
          </div>
        </div>

        {/* Four Compact Metrics (Local Mock State Values) */}
        <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
          <div className="bg-[#0D0F12] border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Connected
            </div>
            <div className="text-xl font-black text-white">
              {connectedCount}
            </div>
          </div>

          <div className="bg-[#0D0F12] border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active
            </div>
            <div className="text-xl font-black text-blue-400">
              {activeCount}
            </div>
          </div>

          <div className="bg-[#0D0F12] border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Awaiting approval
            </div>
            <div className="text-xl font-black text-amber-400">
              {approvalCount}
            </div>
          </div>

          <div className="bg-[#0D0F12] border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Completed
            </div>
            <div className="text-xl font-black text-emerald-400">
              {completedCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
