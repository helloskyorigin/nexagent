'use client';

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { MemoryCategory, createMemoryRecord } from '../../services/memory/memoryService';
import { cn } from '../../lib/utils';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultCategory?: MemoryCategory;
}

const CATEGORIES: MemoryCategory[] = ['Preferences', 'Facts', 'Context', 'Goals'];

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultCategory = 'Preferences',
}) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MemoryCategory>(defaultCategory);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      createMemoryRecord({
        title: title.trim() || undefined,
        content: content.trim(),
        category,
      });

      setContent('');
      setTitle('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create memory:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        id="add-memory-modal"
        className={cn(
          'relative w-full max-w-lg rounded-2xl z-10',
          'bg-[#121520] border border-white/[0.12]',
          'shadow-2xl shadow-black/80',
          'p-6 animate-in zoom-in-95 duration-150'
        )}
      >
        {/* Close Button */}
        <button
          id="close-add-memory-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white tracking-tight">Add memory</h2>
          <p className="text-sm text-slate-400 mt-1">What should Nexorbit remember?</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Main Content Input */}
          <div>
            <textarea
              id="memory-content-input"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. I prefer concise bullet points, structured summaries, and TypeScript examples."
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl text-sm leading-relaxed',
                'bg-[#0b0d13] border border-white/[0.1] text-white placeholder:text-slate-500',
                'focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50',
                'transition-colors resize-none'
              )}
              autoFocus
              required
            />
          </div>

          {/* Optional Title Input */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Title <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              id="memory-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Code Style Preference"
              className={cn(
                'w-full px-3.5 py-2 rounded-xl text-sm',
                'bg-[#0b0d13] border border-white/[0.1] text-white placeholder:text-slate-500',
                'focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50',
                'transition-colors'
              )}
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`select-category-${cat.toLowerCase()}`}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                    category === cat
                      ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                      : 'bg-white/[0.02] text-slate-400 border-white/[0.08] hover:text-slate-200 hover:bg-white/[0.04]'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
            <button
              id="cancel-add-memory-btn"
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
              id="save-add-memory-btn"
              type="submit"
              disabled={!content.trim() || isSaving}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium',
                'bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none text-white',
                'shadow-lg shadow-blue-600/20 active:scale-[0.98]',
                'transition-all duration-150'
              )}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
