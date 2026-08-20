'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface RenameModalProps {
  isOpen: boolean;
  currentTitle: string;
  onClose: () => void;
  onSave: (newTitle: string) => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  currentTitle,
  onClose,
  onSave,
}) => {
  const [titleInput, setTitleInput] = useState(currentTitle);
  const [prevTitle, setPrevTitle] = useState(currentTitle);

  if (currentTitle !== prevTitle) {
    setPrevTitle(currentTitle);
    setTitleInput(currentTitle);
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleInput.trim()) {
      onSave(titleInput.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#15181D] border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Rename Conversation
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter a new title for this conversation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Conversation title..."
            autoFocus
            className="w-full h-10 px-3.5 rounded-xl bg-[#0D0F12] border border-slate-700/80 focus:border-blue-500 text-sm text-white outline-none placeholder:text-slate-500 transition-colors"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!titleInput.trim()}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              Save Title
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
