'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { MemoryRecord, formatMemoryDate } from '../../services/memory/memoryService';
import { MemoryCategoryIcon } from './MemoryCategoryIcon';
import { MemoryCategoryTag } from './MemoryCategoryTag';
import { cn } from '../../lib/utils';

interface MemoryRowProps {
  memory: MemoryRecord;
  onEdit: (memory: MemoryRecord) => void;
  onDelete: (memory: MemoryRecord) => void;
}

export const MemoryRow: React.FC<MemoryRowProps> = ({
  memory,
  onEdit,
  onDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const timestampDisplay = formatMemoryDate(memory.updatedAt || memory.createdAt);

  return (
    <div
      id={`memory-item-${memory.id}`}
      className={cn(
        'group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl',
        'bg-[#11131c]/90 hover:bg-[#151824]/90',
        'border border-white/[0.07] hover:border-white/[0.14]',
        'transition-all duration-200 shadow-sm'
      )}
    >
      {/* Category Icon */}
      <div className="pt-0.5">
        <MemoryCategoryIcon category={memory.category} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight break-words">
            {memory.title}
          </h3>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mt-1.5 break-words whitespace-pre-wrap">
          {memory.content}
        </p>

        {/* Category Pill Tag */}
        <div className="mt-3.5 flex items-center gap-2">
          <MemoryCategoryTag category={memory.category} />
        </div>
      </div>

      {/* Right Area: Timestamp and Actions Menu */}
      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        {timestampDisplay && (
          <span className="hidden sm:inline-block text-xs font-medium text-slate-400">
            {timestampDisplay}
          </span>
        )}

        {/* ⋯ Menu */}
        <div className="relative" ref={menuRef}>
          <button
            id={`memory-menu-btn-${memory.id}`}
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              'text-slate-400 hover:text-white',
              'hover:bg-white/[0.08] active:bg-white/[0.12]',
              'transition-colors focus:outline-none',
              isMenuOpen && 'bg-white/[0.08] text-white'
            )}
            title="More options"
            aria-label="More options"
          >
            <MoreHorizontal size={17} />
          </button>

          {isMenuOpen && (
            <div
              className={cn(
                'absolute right-0 top-full mt-1.5 w-36 py-1.5 rounded-xl z-30',
                'bg-[#181b28] border border-white/[0.12] shadow-xl shadow-black/60',
                'animate-in fade-in zoom-in-95 duration-150'
              )}
            >
              <button
                id={`memory-edit-btn-${memory.id}`}
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit(memory);
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium',
                  'text-slate-200 hover:text-white hover:bg-white/[0.06]',
                  'transition-colors text-left'
                )}
              >
                <Pencil size={14} className="text-slate-400" />
                <span>Edit</span>
              </button>

              <button
                id={`memory-delete-btn-${memory.id}`}
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete(memory);
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium',
                  'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10',
                  'transition-colors text-left'
                )}
              >
                <Trash2 size={14} className="text-rose-400" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
