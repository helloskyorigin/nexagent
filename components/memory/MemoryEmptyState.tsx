'use client';

import React from 'react';
import { Plus, Brain } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MemoryEmptyStateProps {
  onAddMemory: () => void;
  isFiltered?: boolean;
}

export const MemoryEmptyState: React.FC<MemoryEmptyStateProps> = ({
  onAddMemory,
  isFiltered = false,
}) => {
  return (
    <div
      id="memory-empty-state"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-16 sm:py-24 px-4 rounded-2xl',
        'border border-dashed border-white/[0.08] bg-[#0e1017]/40'
      )}
    >
      {/* Centered Minimal Icon */}
      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-sm shadow-blue-500/5">
        <Brain size={26} strokeWidth={1.8} />
      </div>

      {/* Heading */}
      <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
        {isFiltered ? 'No memories found in this category' : 'Nothing remembered yet'}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 max-w-md mt-1.5 mb-6 leading-relaxed">
        {isFiltered
          ? 'Try switching to a different category or create a new memory for this filter.'
          : 'As you chat with Nexorbit, useful information you choose to keep can appear here.'}
      </p>

      {/* Primary Action */}
      <button
        id="empty-state-add-memory-btn"
        type="button"
        onClick={onAddMemory}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium',
          'bg-blue-600 hover:bg-blue-500 text-white',
          'shadow-lg shadow-blue-600/20 active:scale-[0.98]',
          'transition-all duration-150'
        )}
      >
        <Plus size={16} strokeWidth={2.2} />
        <span>Add memory</span>
      </button>
    </div>
  );
};
