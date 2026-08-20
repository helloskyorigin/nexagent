'use client';

import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { createNoteItem } from '../../services/library/libraryService';
import { cn } from '../../lib/utils';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      createNoteItem(title.trim() || 'Untitled Note', content.trim());
      setTitle('');
      setContent('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create note:', err);
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
        id="add-note-modal"
        className={cn(
          'relative w-full max-w-lg rounded-2xl z-10',
          'bg-[#121520] border border-white/[0.12]',
          'shadow-2xl shadow-black/80',
          'p-6 animate-in zoom-in-95 duration-150'
        )}
      >
        {/* Close Button */}
        <button
          id="close-add-note-modal"
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
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText size={16} />
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Add note</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Write down research notes, meeting summaries, or project drafts.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Note title</label>
            <input
              id="note-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Startup Ideas Brainstorm"
              className={cn(
                'w-full px-3.5 py-2 rounded-xl text-sm',
                'bg-[#0b0d13] border border-white/[0.1] text-white placeholder:text-slate-500',
                'focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50',
                'transition-colors'
              )}
              autoFocus
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Content <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="note-content-input"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note content here..."
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl text-sm leading-relaxed',
                'bg-[#0b0d13] border border-white/[0.1] text-white placeholder:text-slate-500',
                'focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50',
                'transition-colors resize-none'
              )}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
            <button
              id="cancel-add-note-btn"
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
              id="submit-add-note-btn"
              type="submit"
              disabled={!content.trim() || isSaving}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium',
                'bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white',
                'shadow-lg shadow-blue-600/20 active:scale-[0.98]',
                'transition-all duration-150'
              )}
            >
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
