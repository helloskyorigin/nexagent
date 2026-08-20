'use client';

import React from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { PluginItem } from '../../services/integrations/types';
import { getPluginIcon } from './PluginIcons';

interface DisconnectConfirmationModalProps {
  isOpen: boolean;
  plugin: PluginItem | null;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const DisconnectConfirmationModal: React.FC<DisconnectConfirmationModalProps> = ({
  isOpen,
  plugin,
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  if (!isOpen || !plugin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#121520] border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="h-11 w-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Disconnect {plugin.name}?
            </h2>
            <p className="text-xs text-slate-400">
              Revoke workspace access for this plugin
            </p>
          </div>
        </div>

        {/* Body Text */}
        <div className="py-2 text-xs text-slate-300 space-y-2.5 leading-relaxed">
          <p>
            Nexorbit will immediately revoke access to{' '}
            <strong className="text-white">{plugin.accountEmail || plugin.name}</strong>.
          </p>
          <p className="text-slate-400">
            Stored sync credentials will be removed. Any ongoing or future Agent tasks requiring{' '}
            {plugin.name} will be paused until reconnected.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 active:scale-[0.98]"
          >
            {isProcessing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>Disconnect {plugin.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
