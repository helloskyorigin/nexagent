'use client';

import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { MemoryItem } from './types';

export interface ForgetMemoryModalProps {
  memory: MemoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmForget: (memory: MemoryItem) => void;
}

export const ForgetMemoryModal: React.FC<ForgetMemoryModalProps> = ({
  memory,
  isOpen,
  onClose,
  onConfirmForget,
}) => {
  if (!isOpen || !memory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 text-left space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="space-y-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900">
              Forget this memory?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nexorbit will no longer use <span className="font-semibold text-slate-800">&ldquo;{memory.title}&rdquo;</span> for future responses and recommendations.
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 font-normal">
          This action will permanently delete this memory index item from your connected world context.
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirmForget(memory)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Forget</span>
          </button>
        </div>
      </div>
    </div>
  );
};
