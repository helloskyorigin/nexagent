'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  ChevronDown,
  Upload,
  Link as LinkIcon,
  FileText,
  Code2,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface LibraryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUploadFile: () => void;
  onSaveLink: () => void;
  onAddNote: () => void;
  onAddCode: () => void;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onUploadFile,
  onSaveLink,
  onAddNote,
  onAddCode,
}) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAddMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAddMenuOpen]);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Library
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Your saved content, files and resources.
        </p>
      </div>

      {/* Top-Right: Search Input & Add New Dropdown */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 md:w-64">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            id="search-library-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search library..."
            className={cn(
              'w-full pl-9 pr-8 py-2 rounded-xl text-sm',
              'bg-[#11131c] border border-white/[0.1] text-white placeholder:text-slate-500',
              'focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50',
              'transition-all duration-150'
            )}
          />
          {searchQuery && (
            <button
              id="clear-search-library-btn"
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* + Add New ▾ Dropdown */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            id="header-add-new-btn"
            type="button"
            onClick={() => setIsAddMenuOpen((prev) => !prev)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium',
              'bg-blue-600 hover:bg-blue-500 text-white',
              'shadow-lg shadow-blue-600/20 active:scale-[0.98]',
              'transition-all duration-150'
            )}
          >
            <Plus size={16} strokeWidth={2.2} />
            <span>Add New</span>
            <ChevronDown size={14} className={cn('transition-transform', isAddMenuOpen && 'rotate-180')} />
          </button>

          {isAddMenuOpen && (
            <div
              className={cn(
                'absolute right-0 top-full mt-1.5 w-44 py-1.5 rounded-xl z-30',
                'bg-[#181b28] border border-white/[0.12] shadow-2xl shadow-black/80',
                'animate-in fade-in zoom-in-95 duration-150'
              )}
            >
              <button
                id="add-upload-file-btn"
                type="button"
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onUploadFile();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/[0.06] transition-colors text-left"
              >
                <Upload size={14} className="text-white" />
                <span>Upload file</span>
              </button>

              <button
                id="add-save-link-btn"
                type="button"
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onSaveLink();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/[0.06] transition-colors text-left"
              >
                <LinkIcon size={14} className="text-white" />
                <span>Save link</span>
              </button>

              <button
                id="add-note-btn"
                type="button"
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onAddNote();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/[0.06] transition-colors text-left"
              >
                <FileText size={14} className="text-white" />
                <span>Add note</span>
              </button>

              <button
                id="add-code-btn"
                type="button"
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onAddCode();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/[0.06] transition-colors text-left"
              >
                <Code2 size={14} className="text-white" />
                <span>Add code</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
