'use client';

import React, { useState } from 'react';
import { X, Code2 } from 'lucide-react';
import { createCodeItem } from '../../services/library/libraryService';
import { cn } from '../../lib/utils';

interface AddCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LANGUAGES = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Rust',
  'Go',
  'SQL',
  'HTML',
  'CSS',
  'JSON',
  'Shell',
  'C++',
  'Markdown',
];

export const AddCodeModal: React.FC<AddCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('TypeScript');
  const [code, setCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSaving(true);
    try {
      createCodeItem(
        title.trim() || `${language} Snippet`,
        code.trim(),
        language
      );
      setTitle('');
      setCode('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save code snippet:', err);
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
        id="add-code-modal"
        className={cn(
          'relative w-full max-w-xl rounded-2xl z-10',
          'bg-[#121520] border border-white/[0.12]',
          'shadow-2xl shadow-black/80',
          'p-6 animate-in zoom-in-95 duration-150'
        )}
      >
        {/* Close Button */}
        <button
          id="close-add-code-modal"
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
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Code2 size={16} />
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Add code snippet</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Store useful scripts, algorithms, utilities, and configurations.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Title Input */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Title</label>
              <input
                id="code-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Python: Web Scraper Snippet"
                className={cn(
                  'w-full px-3.5 py-2 rounded-xl text-sm',
                  'bg-[#0b0d13] border border-white/[0.1] text-white placeholder:text-slate-500',
                  'focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50',
                  'transition-colors'
                )}
                autoFocus
              />
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Language</label>
              <select
                id="code-language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={cn(
                  'w-full px-3 py-2 rounded-xl text-sm',
                  'bg-[#0b0d13] border border-white/[0.1] text-white',
                  'focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50',
                  'transition-colors cursor-pointer'
                )}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-[#121520] text-white">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Code Textarea */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Code <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="code-content-input"
              rows={8}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Paste your ${language} code snippet here...`}
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono leading-relaxed',
                'bg-[#0b0d13] border border-white/[0.1] text-slate-100 placeholder:text-slate-600',
                'focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50',
                'transition-colors resize-none'
              )}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
            <button
              id="cancel-add-code-btn"
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
              id="submit-add-code-btn"
              type="submit"
              disabled={!code.trim() || isSaving}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium',
                'bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:pointer-events-none text-white',
                'shadow-lg shadow-amber-600/20 active:scale-[0.98]',
                'transition-all duration-150'
              )}
            >
              {isSaving ? 'Saving...' : 'Save Snippet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
