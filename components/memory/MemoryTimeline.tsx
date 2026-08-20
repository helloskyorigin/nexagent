'use client';

import React from 'react';
import { Clock, Inbox, RotateCcw } from 'lucide-react';
import { MemoryItem } from './types';
import { MemoryCard } from './MemoryCard';

export interface MemoryTimelineProps {
  memories: MemoryItem[];
  selectedMemory: MemoryItem | null;
  onSelectMemory: (memory: MemoryItem) => void;
  onResetFilters?: () => void;
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({
  memories,
  selectedMemory,
  onSelectMemory,
  onResetFilters,
}) => {
  if (memories.length === 0) {
    return (
      <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200/80 text-center space-y-4 shadow-2xs">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100/60">
          <Inbox className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900">No memories found.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Nexorbit couldn’t find any remembered information matching your search or active filter.
          </p>
        </div>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Recent Memories</span>
        </h3>
        <span className="text-[11px] font-semibold text-slate-400">
          {memories.length} {memories.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Memory Rows List */}
      <div className="space-y-2">
        {memories.map((mem) => (
          <MemoryCard
            key={mem.id}
            memory={mem}
            isSelected={selectedMemory?.id === mem.id}
            onClick={onSelectMemory}
          />
        ))}
      </div>
    </div>
  );
};

