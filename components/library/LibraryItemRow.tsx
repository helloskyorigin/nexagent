'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MoreHorizontal,
  ExternalLink,
  Download,
  Pencil,
  Trash2,
  Copy,
  Eye,
  Check,
} from 'lucide-react';
import {
  LibraryItem,
  formatFileSize,
  formatLibraryTimestamp,
} from '../../services/library/libraryService';
import { LibraryItemIcon } from './LibraryItemIcon';
import { LibraryItemBadge } from './LibraryItemBadge';
import { cn } from '../../lib/utils';
import { useToast } from '../ui/Toast';

interface LibraryItemRowProps {
  item: LibraryItem;
  onOpen: (item: LibraryItem) => void;
  onRename: (item: LibraryItem) => void;
  onDelete: (item: LibraryItem) => void;
}

export const LibraryItemRow: React.FC<LibraryItemRowProps> = ({
  item,
  onOpen,
  onRename,
  onDelete,
}) => {
  const { addToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu on outside click
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

  const timestamp = formatLibraryTimestamp(item.updatedAt || item.createdAt);
  const formattedSize = formatFileSize(item.fileSize);

  // Build secondary subtitle string
  const getSubtitle = () => {
    if (item.type === 'bookmark' && item.url) {
      return item.url;
    }
    const parts: string[] = [];
    if (item.fileType) parts.push(item.fileType);
    if (formattedSize) parts.push(formattedSize);
    return parts.join(' · ') || item.type;
  };

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (item.content) {
      try {
        await navigator.clipboard.writeText(item.content);
        setHasCopied(true);
        addToast({
          title: 'Code Copied',
          description: 'Code snippet copied to clipboard.',
          type: 'success',
        });
        setTimeout(() => setHasCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code', err);
      }
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    if (item.dataUrl) {
      const a = document.createElement('a');
      a.href = item.dataUrl;
      a.download = item.fileName || `${item.title}.${item.fileType?.toLowerCase() || 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (item.content) {
      const blob = new Blob([item.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.title}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      id={`library-item-${item.id}`}
      onClick={() => onOpen(item)}
      className={cn(
        'group relative flex items-center justify-between gap-4 p-4 sm:p-4.5 rounded-2xl cursor-pointer',
        'bg-[#11131c]/90 hover:bg-[#151824]/90',
        'border border-white/[0.07] hover:border-white/[0.14]',
        'transition-all duration-200 shadow-xs'
      )}
    >
      {/* Left: Icon & Meta */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <LibraryItemIcon type={item.type} fileType={item.fileType} />

        <div className="min-w-0 flex-1">
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate group-hover:text-blue-400 transition-colors">
            {item.title}
          </h4>
          <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">
            {getSubtitle()}
          </p>
        </div>
      </div>

      {/* Right: Badge, Timestamp & Menu */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* Category Badge */}
        <div className="hidden sm:block">
          <LibraryItemBadge type={item.type} />
        </div>

        {/* Real Date/Time */}
        <div className="hidden md:flex flex-col items-end text-right text-xs">
          <span className="font-medium text-slate-300">{timestamp.date}</span>
          {timestamp.time && (
            <span className="text-[11px] text-slate-500 font-normal">{timestamp.time}</span>
          )}
        </div>

        {/* ⋯ Menu */}
        <div className="relative" ref={menuRef}>
          <button
            id={`library-menu-btn-${item.id}`}
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              'text-slate-400 hover:text-white',
              'hover:bg-white/[0.08] active:bg-white/[0.12]',
              'transition-colors focus:outline-none',
              isMenuOpen && 'bg-white/[0.08] text-white'
            )}
            title="Options"
            aria-label="Options"
          >
            <MoreHorizontal size={17} />
          </button>

          {isMenuOpen && (
            <div
              className={cn(
                'absolute right-0 top-full mt-1.5 w-40 py-1.5 rounded-xl z-30',
                'bg-[#181b28] border border-white/[0.12] shadow-2xl shadow-black/80',
                'animate-in fade-in zoom-in-95 duration-150'
              )}
            >
              {/* Context Action 1: Open / Preview / External Link */}
              {item.type === 'bookmark' && item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <ExternalLink size={14} className="text-slate-400" />
                  <span>Open link</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpen(item);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                >
                  <Eye size={14} className="text-slate-400" />
                  <span>Open</span>
                </button>
              )}

              {/* Code Snippet: Copy Action */}
              {item.type === 'code' && (
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                >
                  {hasCopied ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} className="text-slate-400" />
                  )}
                  <span>{hasCopied ? 'Copied' : 'Copy code'}</span>
                </button>
              )}

              {/* Download Action (for files and images with dataUrl or content) */}
              {(item.dataUrl || item.content) && item.type !== 'bookmark' && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                >
                  <Download size={14} className="text-slate-400" />
                  <span>Download</span>
                </button>
              )}

              {/* Rename / Edit Action */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onRename(item);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
              >
                <Pencil size={14} className="text-slate-400" />
                <span>{item.type === 'document' || item.type === 'code' ? 'Edit' : 'Rename'}</span>
              </button>

              {/* Divider */}
              <div className="my-1 border-t border-white/[0.08]" />

              {/* Delete Action */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete(item);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
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
