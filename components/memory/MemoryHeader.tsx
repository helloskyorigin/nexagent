'use client';

import React from 'react';
import { Search, Plus, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MemoryHeaderProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onAddMemory: () => void;
}

export const MemoryHeader: React.FC<MemoryHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onAddMemory,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Memory
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Information Nexorbit remembers to make your conversations more useful.
        </p>
      </div>

      {/* Top-Right: Search Input & Add Action */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 md:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            id="search-memory-input"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search memory..."
            className={cn(
              'w-full pl-9 pr-8 py-2 rounded-xl text-sm',
              'bg-[#11131c] border border-white/[0.1] text-white placeholder:text-slate-500',
              'focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50',
              'transition-all duration-150'
            )}
          />
          {searchTerm && (
            <button
              id="clear-search-memory-btn"
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Add Memory Button */}
        <button
          id="header-add-memory-btn"
          type="button"
          onClick={onAddMemory}
          className={cn(
            'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium shrink-0',
            'bg-blue-600 hover:bg-blue-500 text-white',
            'shadow-lg shadow-blue-600/20 active:scale-[0.98]',
            'transition-all duration-150'
          )}
        >
          <Plus size={16} strokeWidth={2.2} />
          <span className="hidden sm:inline">Add memory</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </div>
  );
};
