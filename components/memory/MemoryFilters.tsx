'use client';

import React from 'react';
import { MemoryCategory } from '../../services/memory/memoryService';
import { cn } from '../../lib/utils';

export type FilterOption = 'All' | MemoryCategory;

interface MemoryFiltersProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const FILTER_TABS: FilterOption[] = ['All', 'Preferences', 'Facts', 'Context', 'Goals'];

export const MemoryFilters: React.FC<MemoryFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
      {FILTER_TABS.map((tab) => {
        const isActive = activeFilter === tab;
        return (
          <button
            key={tab}
            id={`memory-filter-${tab.toLowerCase()}`}
            type="button"
            onClick={() => onFilterChange(tab)}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 shrink-0 select-none',
              isActive
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
