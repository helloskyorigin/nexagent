'use client';

import React from 'react';
import { Sparkles, ArrowUpRight, Check, RotateCcw } from 'lucide-react';
import { ConnectorSourceId, ViewToggleControls } from './types';
import { SourceIcon } from './SourceIcon';
import { MOCK_MOST_ACTIVE_SOURCES, WEEKLY_ACTIVITY_DATA } from './mockData';
import { cn } from '../../lib/utils';

export interface RightIntelligenceRailProps {
  selectedSourceFilter: ConnectorSourceId | null;
  onSelectSourceFilter: (sourceId: ConnectorSourceId | null) => void;
  viewControls: ViewToggleControls;
  onToggleViewControl: (key: keyof ViewToggleControls) => void;
  totalNewChangesCount?: number;
  className?: string;
}

export const RightIntelligenceRail: React.FC<RightIntelligenceRailProps> = ({
  selectedSourceFilter,
  onSelectSourceFilter,
  viewControls,
  onToggleViewControl,
  totalNewChangesCount = 18,
  className,
}) => {
  return (
    <div className={cn("space-y-5 w-full", className)}>
      {/* 1. CHANGE SUMMARY CARD */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
            Change Summary
          </h3>
          <Sparkles className="h-4 w-4 text-indigo-500" />
        </div>

        {/* Big Metric */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {totalNewChangesCount}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            new changes
          </span>
        </div>

        {/* Comparison Trend */}
        <div className="flex items-center justify-between mt-1 text-xs text-slate-500 font-medium">
          <span>vs yesterday</span>
          <div className="flex items-center gap-0.5 text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/80">
            <span>↑</span>
            <span>32%</span>
          </div>
        </div>

        {/* Activity Rhythm Bar Chart */}
        <div className="mt-6 pt-2">
          <div className="flex items-end justify-between gap-2 h-20 px-1 pb-1">
            {WEEKLY_ACTIVITY_DATA.map((item, idx) => {
              const maxCount = 20;
              const heightPercent = Math.min(100, Math.max(25, (item.count / maxCount) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={cn(
                        "w-full max-w-[20px] rounded-lg transition-all duration-300",
                        item.active
                          ? "bg-[#4F46E5] shadow-[0_2px_8px_rgba(79,70,229,0.3)]"
                          : "bg-[#E0E7FF]/70 hover:bg-[#C7D2FE]"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold tracking-wider",
                      item.active ? "text-[#4F46E5] font-bold" : "text-slate-400"
                    )}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. MOST ACTIVE SOURCES CARD */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
            Most Active Sources
          </h3>
          {selectedSourceFilter && (
            <button
              onClick={() => onSelectSourceFilter(null)}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {MOCK_MOST_ACTIVE_SOURCES.map((source) => {
            const isSelected = selectedSourceFilter === source.sourceId;

            return (
              <button
                key={source.sourceId}
                id={`source-filter-${source.sourceId}`}
                onClick={() =>
                  onSelectSourceFilter(isSelected ? null : source.sourceId)
                }
                className={cn(
                  "w-full flex items-center justify-between p-2 rounded-xl transition-all duration-150 cursor-pointer text-left",
                  isSelected
                    ? "bg-indigo-50/90 text-indigo-900 border border-indigo-200/80 font-semibold"
                    : "hover:bg-slate-50 text-slate-700 font-medium"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <SourceIcon type={source.sourceId} className="h-4 w-4 shrink-0" />
                  <span className="text-xs">{source.sourceName}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {source.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SHOW CHANGES FROM (VIEW CONTROLS) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <h3 className="text-[14px] font-bold text-slate-900 tracking-tight mb-4">
          Show changes from
        </h3>

        <div className="space-y-3.5">
          {/* Connected Apps Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 font-medium">
              Connected apps
            </span>
            <ToggleSwitch
              id="toggle-connected-apps"
              checked={viewControls.connectedApps}
              onChange={() => onToggleViewControl('connectedApps')}
            />
          </div>

          {/* Your Team Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 font-medium">
              Your team
            </span>
            <ToggleSwitch
              id="toggle-your-team"
              checked={viewControls.yourTeam}
              onChange={() => onToggleViewControl('yourTeam')}
            />
          </div>

          {/* Mentions Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 font-medium">
              Mentions
            </span>
            <ToggleSwitch
              id="toggle-mentions"
              checked={viewControls.mentions}
              onChange={() => onToggleViewControl('mentions')}
            />
          </div>

          {/* Tasks & Projects Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 font-medium">
              Tasks & projects
            </span>
            <ToggleSwitch
              id="toggle-tasks"
              checked={viewControls.tasksAndProjects}
              onChange={() => onToggleViewControl('tasksAndProjects')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ToggleSwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange }) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        checked ? "bg-[#4F46E5]" : "bg-slate-200"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
};
