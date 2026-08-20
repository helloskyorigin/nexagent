'use client';

import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { MemoryRecord, deleteMemoryRecord } from '../../services/memory/memoryService';
import { cn } from '../../lib/utils';

interface DeleteMemoryModalProps {
  isOpen: boolean;
  memory: MemoryRecord | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DeleteMemoryModal: React.FC<DeleteMemoryModalProps> = ({
  isOpen,
  memory,
  onClose,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !memory) return null;

  const handleDelete = () => {
    setIsDeleting(true);
    try {
      deleteMemoryRecord(memory.id);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to delete memory:', err);
    } finally {
      setIsDeleting(false);
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
        id="delete-memory-modal"
        className={cn(
          'relative w-full max-w-md rounded-2xl z-10',
          'bg-[#121520] border border-white/[0.12]',
          'shadow-2xl shadow-black/80',
          'p-6 animate-in zoom-in-95 duration-150'
        )}
      >
        {/* Close Button */}
        <button
          id="close-delete-memory-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Content */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <Trash2 size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Delete memory?</h2>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Nexorbit will no longer remember this detail in future conversations.
            </p>
          </div>
        </div>

        {/* Preview of memory to delete */}
        <div className="p-3.5 rounded-xl bg-[#0b0d13] border border-white/[0.08] mb-6">
          <p className="text-xs font-semibold text-slate-300 line-clamp-1">{memory.title}</p>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1">{memory.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            id="cancel-delete-memory-btn"
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
            id="confirm-delete-memory-btn"
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium',
              'bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white',
              'shadow-lg shadow-rose-600/20 active:scale-[0.98]',
              'transition-all duration-150'
            )}
          >
            {isDeleting ? 'Deleting...' : 'Delete Memory'}
          </button>
        </div>
      </div>
    </div>
  );
};
