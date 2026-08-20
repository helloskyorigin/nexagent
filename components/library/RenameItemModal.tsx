'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LibraryItem, updateLibraryItem } from '../../services/library/libraryService';
import { cn } from '../../lib/utils';

interface RenameItemModalProps {
  isOpen: boolean;
  item: LibraryItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface InnerFormProps {
  item: LibraryItem;
  onClose: () => void;
  onSuccess?: () => void;
}

const RenameForm: React.FC<InnerFormProps> = ({ item, onClose, onSuccess }) => {
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content || '');
  const [url, setUrl] = useState(item.url || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      const updates: Partial<LibraryItem> = {
        title: title.trim(),
      };

      if (item.type === 'bookmark') {
        updates.url = url.trim() || item.url;
      }
      if (item.type === 'document' || item.type === 'code') {
        updates.content = content.trim();
        updates.fileSize = new Blob([title + content]).size;
      }

      updateLibraryItem(item.id, updates);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update library item:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id="rename-item-modal"
      className={cn(
        'relative w-full max-w-lg rounded-2xl z-10',
        'bg-[#121520] border border-white/[0.12]',
        'shadow-2xl shadow-black/80',
        'p-6 animate-in zoom-in-95 duration-150'
      )}
    >
      <button
        id="close-rename-modal"
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        aria-label="Close"
      >
        <X size={18} />
      </button>

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white tracking-tight">
          {item.type === 'document' || item.type === 'code' ? 'Edit item' : 'Rename item'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">Update details for this saved item.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Title</label>
          <input
            id="rename-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={cn(
              'w-full px-3.5 py-2 rounded-xl text-sm',
              'bg-[#0b0d13] border border-white/[0.1] text-white',
              'focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50',
              'transition-colors'
            )}
            autoFocus
            required
          />
        </div>

        {item.type === 'bookmark' && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">URL</label>
            <input
              id="rename-url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={cn(
                'w-full px-3.5 py-2 rounded-xl text-sm',
                'bg-[#0b0d13] border border-white/[0.1] text-white',
                'focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50',
                'transition-colors'
              )}
            />
          </div>
        )}

        {(item.type === 'document' || item.type === 'code') && (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Content</label>
            <textarea
              id="rename-content-input"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={cn(
                'w-full px-3.5 py-2 rounded-xl text-sm font-mono',
                'bg-[#0b0d13] border border-white/[0.1] text-white',
                'focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50',
                'transition-colors resize-none'
              )}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
          <button
            id="cancel-rename-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Cancel
          </button>
          <button
            id="submit-rename-btn"
            type="submit"
            disabled={!title.trim() || isSaving}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const RenameItemModal: React.FC<RenameItemModalProps> = ({
  isOpen,
  item,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />
      <RenameForm
        key={item.id}
        item={item}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </div>
  );
};
