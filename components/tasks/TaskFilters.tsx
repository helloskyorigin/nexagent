'use client';

import React from 'react';

export type TaskFilterTab = 'all' | 'active' | 'in_progress' | 'completed' | 'scheduled';

export interface TaskFilterCounts {
  all: number;
  active: number;
  inProgress: number;
  completed: number;
  scheduled: number;
}

interface TaskFiltersProps {
  currentTab: TaskFilterTab;
  onSelectTab: (tab: TaskFilterTab) => void;
  counts: TaskFilterCounts;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentTab,
  onSelectTab,
  counts,
}) => {
  const tabs: { id: TaskFilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'in_progress', label: 'In Progress', count: counts.inProgress },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'scheduled', label: 'Scheduled', count: counts.scheduled },
  ];

  return (
    <div className="flex items-center gap-6 sm:gap-8 border-b border-white/[0.06] overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`group pb-3.5 pt-1 text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 relative ${
              isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>

            {/* Dynamic Count Badge */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${
                isActive
                  ? 'bg-blue-600/25 text-blue-400 border border-blue-500/30'
                  : 'bg-white/[0.04] text-slate-400 group-hover:text-slate-300'
              }`}
            >
              {tab.count}
            </span>

            {/* Subtle Nexorbit-Blue Underline Accent */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
