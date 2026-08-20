'use client';

import React from 'react';
import { Filter, Check, X, RotateCcw } from 'lucide-react';
import { ChangeImportance, ConnectorSourceId } from './types';
import { SourceIcon } from './SourceIcon';
import { cn } from '../../lib/utils';

export interface FilterState {
  importance: ChangeImportance | 'all';
  unreadOnly: boolean;
  source: ConnectorSourceId | 'all';
}

export interface FilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = React.useState<FilterState>(filters);

  if (!isOpen) return null;

  const sources: { id: ConnectorSourceId | 'all'; label: string }[] = [
    { id: 'all', label: 'All Sources' },
    { id: 'gmail', label: 'Gmail' },
    { id: 'calendar', label: 'Google Calendar' },
    { id: 'drive', label: 'Google Drive' },
    { id: 'slack', label: 'Slack' },
    { id: 'notion', label: 'Notion' },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center sm:justify-end sm:pr-24 pt-28">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/10 backdrop-blur-2xs"
        onClick={onClose}
      />

      {/* Popover Box */}
      <div className="relative z-50 w-80 bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-5 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Filter className="h-4 w-4 text-indigo-600" />
            <span>Filter Changes</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Importance Filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">
            Signal Importance
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {[
              { id: 'all', label: 'All Levels' },
              { id: 'important', label: 'Actionable' },
              { id: 'relevant', label: 'Relevant' },
              { id: 'informational', label: 'Informational' },
            ].map((imp) => (
              <button
                key={imp.id}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    importance: imp.id as any,
                  }))
                }
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-left font-medium transition-all cursor-pointer",
                  localFilters.importance === imp.id
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
                    : "bg-white border-slate-200/70 text-slate-600 hover:bg-slate-50"
                )}
              >
                {imp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Source Filter */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">
            Source Platform
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {sources.map((src) => (
              <button
                key={src.id}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    source: src.id,
                  }))
                }
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left font-medium transition-all cursor-pointer",
                  localFilters.source === src.id
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
                    : "bg-white border-slate-200/70 text-slate-600 hover:bg-slate-50"
                )}
              >
                {src.id !== 'all' && (
                  <SourceIcon type={src.id} className="h-3 w-3 shrink-0" />
                )}
                <span className="truncate">{src.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Unread Only Toggle */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-700 font-medium">
            Only unread changes
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={localFilters.unreadOnly}
            onClick={() =>
              setLocalFilters((prev) => ({
                ...prev,
                unreadOnly: !prev.unreadOnly,
              }))
            }
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
              localFilters.unreadOnly ? "bg-[#4F46E5]" : "bg-slate-200"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                localFilters.unreadOnly ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset all
          </button>

          <button
            onClick={() => {
              onApplyFilters(localFilters);
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
