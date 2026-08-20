'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, Plus, Check } from 'lucide-react';
import { TaskSource } from '../../services/tasks/taskService';

interface TasksHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSourceFilter: TaskSource | 'all';
  onSelectSourceFilter: (source: TaskSource | 'all') => void;
  onOpenNewTask: () => void;
}

export const TasksHeader: React.FC<TasksHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedSourceFilter,
  onSelectSourceFilter,
  onOpenNewTask,
}) => {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterMenuOpen(false);
      }
    };
    if (filterMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterMenuOpen]);

  const sourceOptions: { id: TaskSource | 'all'; label: string }[] = [
    { id: 'all', label: 'All Sources' },
    { id: 'agent', label: 'Agent Tasks' },
    { id: 'chat', label: 'Chat Tasks' },
    { id: 'scheduled', label: 'Scheduled Tasks' },
    { id: 'manual', label: 'Manual Tasks' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Tasks
        </h1>
        <p className="text-sm text-slate-400 font-normal mt-1 leading-relaxed">
          Track and manage all your tasks in one place.
        </p>
      </div>

      {/* Controls: Search, Filter, + New Task */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
        {/* Search Input */}
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-[#121520] border border-white/[0.08] hover:border-white/[0.15] focus:border-blue-500/50 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Button with Source Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            className={`h-9 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              selectedSourceFilter !== 'all'
                ? 'bg-blue-600/15 border-blue-500/30 text-blue-400'
                : 'bg-[#121520] hover:bg-[#161a27] text-slate-400 hover:text-white border-white/[0.08] hover:border-white/[0.15]'
            }`}
            title="Filter options"
            aria-label="Filter tasks by source"
          >
            <Filter className="h-4 w-4" />
            {selectedSourceFilter !== 'all' && (
              <span className="hidden sm:inline text-xs font-semibold">Filtered</span>
            )}
          </button>

          {filterMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-[#161a27] border border-white/[0.1] rounded-xl shadow-2xl z-30 py-1.5 animate-fadeIn">
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-white/[0.05]">
                Filter by Source
              </div>
              <div className="py-1">
                {sourceOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onSelectSourceFilter(opt.id);
                      setFilterMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/[0.06] cursor-pointer transition-colors ${
                      selectedSourceFilter === opt.id
                        ? 'text-blue-400 font-semibold bg-blue-500/10'
                        : 'text-slate-300'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedSourceFilter === opt.id && (
                      <Check className="h-3.5 w-3.5 text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button: + New Task */}
        <button
          type="button"
          onClick={onOpenNewTask}
          className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>
    </div>
  );
};
