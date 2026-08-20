'use client';

import React, { useState } from 'react';
import { X, Filter, Check, RotateCcw, Pin } from 'lucide-react';
import { MemoryCategory, MemorySourceType } from './types';
import { Button } from '../ui/Button';

export interface MemoryFiltersState {
  category: string;
  person: string;
  source: string;
  dateGroup: string;
  pinnedOnly: boolean;
}

export interface MemoryFilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  filters: MemoryFiltersState;
  onApplyFilters: (filters: MemoryFiltersState) => void;
  onResetFilters: () => void;
  peopleOptions: string[];
}

interface FilterFormContentProps {
  filters: MemoryFiltersState;
  onClose: () => void;
  onApplyFilters: (filters: MemoryFiltersState) => void;
  onResetFilters: () => void;
  peopleOptions: string[];
}

const FilterFormContent: React.FC<FilterFormContentProps> = ({
  filters,
  onClose,
  onApplyFilters,
  onResetFilters,
  peopleOptions,
}) => {
  const [localFilters, setLocalFilters] = useState<MemoryFiltersState>(filters);

  const categories: string[] = [
    'all',
    'Projects',
    'People',
    'Preferences',
    'Knowledge',
    'Decisions',
  ];

  const sources = [
    { label: 'All Sources', value: 'all' },
    { label: 'Gmail', value: 'gmail' },
    { label: 'Google Calendar', value: 'calendar' },
    { label: 'Notion', value: 'notion' },
    { label: 'Google Drive', value: 'drive' },
    { label: 'Meeting Notes', value: 'meeting' },
    { label: 'Slack', value: 'slack' },
  ];

  const dateGroups = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'Today' },
    { label: 'Yesterday', value: 'Yesterday' },
    { label: 'Earlier this week', value: 'Earlier this week' },
  ];

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  return (
    <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 text-left shadow-2xl transition-all border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Filter Memories</h3>
        </div>
        <button
          onClick={onClose}
          className="h-7 w-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Category</label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => {
              const isSelected = localFilters.category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    setLocalFilters((prev) => ({ ...prev, category: c }))
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c === 'all' ? 'All Categories' : c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Source Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Source</label>
          <select
            value={localFilters.source}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, source: e.target.value }))
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white cursor-pointer"
          >
            {sources.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* People Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Connected Person</label>
          <select
            value={localFilters.person}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, person: e.target.value }))
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white cursor-pointer"
          >
            <option value="all">All People</option>
            {peopleOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Date Group Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Date Range</label>
          <select
            value={localFilters.dateGroup}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, dateGroup: e.target.value }))
            }
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white cursor-pointer"
          >
            {dateGroups.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pinned Only Toggle */}
        <div className="pt-1 flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2">
            <Pin className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">
              Pinned Memories Only
            </span>
          </div>
          <input
            type="checkbox"
            checked={localFilters.pinnedOnly}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                pinnedOnly: e.target.checked,
              }))
            }
            className="h-4 w-4 rounded-md text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset all</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs h-8 px-3 rounded-xl cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8 px-4 font-semibold rounded-xl shadow-2xs cursor-pointer"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export const MemoryFilterPopover: React.FC<MemoryFilterPopoverProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  peopleOptions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Window rendered conditionally on isOpen */}
        <FilterFormContent
          key={isOpen ? 'open' : 'closed'}
          filters={filters}
          onClose={onClose}
          onApplyFilters={onApplyFilters}
          onResetFilters={onResetFilters}
          peopleOptions={peopleOptions}
        />
      </div>
    </div>
  );
};
