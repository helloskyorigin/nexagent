'use client';

import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useToast } from '../../ui/Toast';

export interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  const { addToast } = useToast();
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText.toLowerCase() === 'delete my account') {
      onClose();
      addToast({
        type: 'error',
        title: 'Account Deletion Requested',
        description: 'Your account deletion request has been scheduled.',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Account"
      description="Permanent removal of all personal data, memories, and app tokens"
      maxWidth="md"
    >
      <form onSubmit={handleDelete} className="space-y-4 pt-2 text-xs">
        {/* Warning Banner */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
          <div className="flex items-center gap-2 font-bold text-rose-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>This action cannot be undone</span>
          </div>
          <p className="text-[11px] text-rose-800 leading-relaxed font-normal">
            Deleting your account will permanently wipe all 142 saved memories, connected app authorizations, personal preferences, and workspace history for <strong className="font-semibold">{userEmail}</strong>.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">
            Type <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-rose-600">DELETE MY ACCOUNT</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE MY ACCOUNT"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={confirmText.toLowerCase() !== 'delete my account'}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Permanently Delete</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
