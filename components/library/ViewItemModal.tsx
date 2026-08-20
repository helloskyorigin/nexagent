'use client';

import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Download,
  Copy,
  Check,
  Calendar,
  HardDrive,
  Pencil,
  Trash2,
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

interface ViewItemModalProps {
  isOpen: boolean;
  item: LibraryItem | null;
  onClose: () => void;
  onEdit: (item: LibraryItem) => void;
  onDelete: (item: LibraryItem) => void;
}

export const ViewItemModal: React.FC<ViewItemModalProps> = ({
  isOpen,
  item,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { addToast } = useToast();
  const [hasCopied, setHasCopied] = useState(false);

  if (!isOpen || !item) return null;

  const timestamp = formatLibraryTimestamp(item.updatedAt || item.createdAt);
  const formattedSize = formatFileSize(item.fileSize);

  const handleCopyContent = async () => {
    const textToCopy = item.content || item.url || item.title;
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setHasCopied(true);
        addToast({
          title: 'Copied',
          description: 'Content copied to clipboard.',
          type: 'success',
        });
        setTimeout(() => setHasCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const handleDownload = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        id="view-item-modal"
        className={cn(
          'relative w-full max-w-2xl rounded-2xl z-10 max-h-[90vh] flex flex-col',
          'bg-[#121520] border border-white/[0.12]',
          'shadow-2xl shadow-black/90',
          'animate-in zoom-in-95 duration-150'
        )}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3.5 min-w-0 pr-4">
            <LibraryItemIcon type={item.type} fileType={item.fileType} />
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white tracking-tight truncate">
                {item.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <LibraryItemBadge type={item.type} />
                {formattedSize && (
                  <span className="text-xs text-slate-400 font-normal">
                    {formattedSize}
                  </span>
                )}
                {timestamp.date && (
                  <span className="text-xs text-slate-500 font-normal">
                    · {timestamp.date}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            id="close-view-item-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Image Preview */}
          {item.type === 'image' && item.dataUrl && (
            <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-black/40 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.dataUrl}
                alt={item.title}
                className="max-h-96 w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Bookmark URL Box */}
          {item.type === 'bookmark' && item.url && (
            <div className="p-4 rounded-xl bg-[#0b0d13] border border-white/[0.08] flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Destination URL
                </div>
                <div className="text-sm font-mono text-blue-400 truncate select-all">
                  {item.url}
                </div>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shrink-0"
              >
                <span>Open Link</span>
                <ExternalLink size={13} />
              </a>
            </div>
          )}

          {/* Code Viewer */}
          {item.type === 'code' && item.content && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">{item.language || item.fileType || 'Code'}</span>
                <button
                  type="button"
                  onClick={handleCopyContent}
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                >
                  {hasCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{hasCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#08090d] border border-white/[0.08] text-slate-200 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto select-all max-h-80">
                <code>{item.content}</code>
              </pre>
            </div>
          )}

          {/* Document / Note Text Viewer */}
          {item.type === 'document' && item.content && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Note Content</span>
                <button
                  type="button"
                  onClick={handleCopyContent}
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                >
                  {hasCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{hasCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-4 rounded-xl bg-[#0b0d13] border border-white/[0.08] text-slate-200 text-sm leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                {item.content}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <button
            id="view-modal-delete-btn"
            type="button"
            onClick={() => {
              onClose();
              onDelete(item);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            {(item.dataUrl || item.content) && item.type !== 'bookmark' && (
              <button
                id="view-modal-download-btn"
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 transition-colors"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
            )}

            <button
              id="view-modal-edit-btn"
              type="button"
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 transition-colors"
            >
              <Pencil size={14} />
              <span>{item.type === 'document' || item.type === 'code' ? 'Edit' : 'Rename'}</span>
            </button>

            <button
              id="view-modal-close-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
