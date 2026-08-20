'use client';

import React from 'react';
import { BookOpen, Plus, Upload, Link as LinkIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LibraryEmptyStateProps {
  onAddClick: () => void;
  onUploadFile?: () => void;
  onSaveLink?: () => void;
  isFiltered?: boolean;
}

export const LibraryEmptyState: React.FC<LibraryEmptyStateProps> = ({
  onAddClick,
  onUploadFile,
  onSaveLink,
  isFiltered = false,
}) => {
  return (
    <div
      id="library-empty-state"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-16 sm:py-24 px-4 rounded-2xl',
        'border border-dashed border-white/[0.08] bg-[#0e1017]/40'
      )}
    >
      {/* Centered Minimal Icon */}
      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-sm shadow-blue-500/5">
        <BookOpen size={26} strokeWidth={1.8} />
      </div>

      {/* Heading */}
      <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
        {isFiltered ? 'No library items found' : 'Your library is empty'}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 max-w-md mt-1.5 mb-6 leading-relaxed">
        {isFiltered
          ? 'No saved items matched your filter or search query.'
          : 'Save files, links, notes and code here so Nexorbit can keep them organized and available when you need them.'}
      </p>

      {/* Primary Button */}
      <button
        id="empty-state-add-btn"
        type="button"
        onClick={onAddClick}
        className={cn(
          'inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-sm font-medium',
          'bg-blue-600 hover:bg-blue-500 text-white',
          'shadow-lg shadow-blue-600/20 active:scale-[0.98]',
          'transition-all duration-150'
        )}
      >
        <Plus size={16} strokeWidth={2.2} />
        <span>+ Add to Library</span>
      </button>

      {/* Secondary Quick Action Hint */}
      {!isFiltered && (
        <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
          <span>Upload a file or save a link to get started.</span>
        </div>
      )}
    </div>
  );
};
