'use client';

import React from 'react';
import { Plus, MessageSquare, Search, CheckSquare } from 'lucide-react';

interface TasksEmptyStateProps {
  isFiltered?: boolean;
  searchQuery?: string;
  onClearFilters?: () => void;
  onCreateTask: () => void;
  onStartChat: () => void;
}

export const TasksEmptyState: React.FC<TasksEmptyStateProps> = ({
  isFiltered = false,
  searchQuery = '',
  onClearFilters,
  onCreateTask,
  onStartChat,
}) => {
  if (isFiltered) {
    return (
      <div className="py-16 px-4 text-center rounded-2xl bg-[#121520]/50 border border-dashed border-white/[0.08] flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400">
          <Search className="h-6 w-6" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-semibold text-white tracking-tight">
            No matching tasks
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {searchQuery
              ? `No tasks found matching "${searchQuery}". Try a different keyword or clear the search filter.`
              : 'No tasks match the selected filter category.'}
          </p>
        </div>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="py-20 px-4 text-center rounded-2xl bg-[#121520]/60 border border-dashed border-white/[0.08] flex flex-col items-center justify-center space-y-5 shadow-inner">
      {/* Minimal Orb Icon */}
      <div className="relative flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-inner">
        <CheckSquare className="h-7 w-7 stroke-[1.8]" />
      </div>

      {/* Heading & Description */}
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-lg font-bold text-white tracking-tight">
          No tasks yet
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Create a task here or turn your Nexorbit conversations into actions.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onCreateTask}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Create your first task</span>
        </button>

        <button
          type="button"
          onClick={onStartChat}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <MessageSquare className="h-4 w-4 text-slate-400" />
          <span>Start a conversation</span>
        </button>
      </div>
    </div>
  );
};
