'use client';

import React, { useState } from 'react';
import { X, Link as LinkIcon } from 'lucide-react';
import { createBookmarkItem } from '../../services/library/libraryService';
import { cn } from '../../lib/utils';

interface SaveLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SaveLinkModal: React.FC<SaveLinkModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSaving(true);
    try {
      createBookmarkItem(url.trim(), title.trim() || undefined);
      setUrl('');
      setTitle('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save bookmark:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        id="save-link-modal"
        className={cn(
          'relative w-full max-w-lg rounded-2xl z-10',
          'bg-[#121520] border border-white/[0.12]',
          'shadow-2xl shadow-black/80',
          'p-6 animate-in zoom-in-95 duration-150'
        )}
      >
        {/* Close Button */}
        <button
          id="close-save-link-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <LinkIcon size={16} />
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Save link</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Bookmark an article, documentation page, repository, or website.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              URL <span className="text-rose-400">*</span>
            </label>
            <input
              id="bookmark-url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/guide"
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl text-sm',
                'bg-[#0b0d13] border border-white/[0.1] text-white placeholder:text-slate-500',
                'focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50',
                'transition-colors'
              )}
              autoFocus
              required
            />
          </div>

          {/* Optional Title Input */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Title <span className="text-slate-500">(optional, will auto-detect if left blank)</span>
            </label>
            <input
              id="bookmark-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quantum Computing Guide"
              className={cn(
                'w-full px-3.5 py-2 rounded-xl text-sm',
                'bg-[#0b0d13] border border-white/[0.1] text-white placeholder:text-slate-500',
                'focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50',
                'transition-colors'
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
            <button
              id="cancel-save-link-btn"
              type="button"
              onClick={onClose}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium',
                'text-slate-300 hover:text-white hover:bg-white/[0.06]',
                'transition-colors'
              )}
            >
              Cancel
            </button>
            <button
              id="submit-save-link-btn"
              type="submit"
              disabled={!url.trim() || isSaving}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium',
                'bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white',
                'shadow-lg shadow-emerald-600/20 active:scale-[0.98]',
                'transition-all duration-150'
              )}
            >
              {isSaving ? 'Saving...' : 'Save Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
