'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

export type PluginFilterTab = 'all' | 'connected' | 'waiting' | 'popular';

interface PluginFiltersProps {
  currentTab: PluginFilterTab;
  onSelectTab: (tab: PluginFilterTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    connected: number;
    waiting: number;
    popular: number;
  };
}

export const PluginFilters: React.FC<PluginFiltersProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  counts,
}) => {
  const tabs: { id: PluginFilterTab; label: string; count?: number }[] = [
    { id: 'all', label: 'All Plugins', count: counts.all },
    { id: 'connected', label: 'Connected', count: counts.connected },
    { id: 'waiting', label: 'Waiting', count: counts.waiting },
    { id: 'popular', label: 'Popular', count: counts.popular },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
      {/* Subtle Segmented Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#121520]/80 border border-white/[0.06] rounded-xl overflow-x-auto scrollbar-none shadow-2xs">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-2xs'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-white/[0.05] text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Compact, Elegant Search Input */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search plugins..."
          className="w-full bg-[#121520]/80 border border-white/[0.07] hover:border-white/[0.14] focus:border-blue-500/50 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
            title="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
};
