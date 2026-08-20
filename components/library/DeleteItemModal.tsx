'use client';

import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { LibraryItem, deleteLibraryItem } from '../../services/library/libraryService';
import { cn } from '../../lib/utils';

interface DeleteItemModalProps {
  isOpen: boolean;
  item: LibraryItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DeleteItemModal: React.FC<DeleteItemModalProps> = ({
  isOpen,
  item,
  onClose,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !item) return null;

  const handleDelete = () => {
    setIsDeleting(true);
    try {
      deleteLibraryItem(item.id);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to delete library item:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        id="delete-item-modal"
        className={cn(
          'relative w-full max-w-md rounded-2xl z-10',
          'bg-[#121520] border border-white/[0.12]',
          'shadow-2xl shadow-black/80',
          'p-6 animate-in zoom-in-95 duration-150'
        )}
      >
        {/* Close Button */}
        <button
          id="close-delete-item-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <Trash2 size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">Delete this item?</h2>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              This action cannot be undone. It will be permanently removed from your library.
            </p>
          </div>
        </div>

        {/* Item Preview Box */}
        <div className="p-3.5 rounded-xl bg-[#0b0d13] border border-white/[0.08] mb-6">
          <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {item.fileType || item.type} {item.url && `· ${item.url}`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            id="cancel-delete-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
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
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
