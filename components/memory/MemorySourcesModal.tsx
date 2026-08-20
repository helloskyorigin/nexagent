'use client';

import React from 'react';
import { X, ArrowRight, CheckCircle2, RefreshCw, ExternalLink } from 'lucide-react';
import { ConnectedSourceStat, MemorySourceType } from './types';
import { MemorySourceIcon } from './MemorySourceIcon';
import { Button } from '../ui/Button';

export interface MemorySourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: ConnectedSourceStat[];
  onSelectSourceFilter: (sourceType: MemorySourceType) => void;
}

export const MemorySourcesModal: React.FC<MemorySourcesModalProps> = ({
  isOpen,
  onClose,
  sources,
  onSelectSourceFilter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Window */}
        <div className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white p-6 sm:p-7 text-left shadow-2xl transition-all border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="space-y-1 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">
              Connected Memory Sources
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Active integrations feeding memories and real-time evidence into Nexorbit.
            </p>
          </div>

          <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto pr-1">
            {sources.map((src) => (
              <div
                key={src.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 transition-colors flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <MemorySourceIcon
                    type={src.type}
                    name={src.name}
                    className="h-9 w-9 text-xs"
                  />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {src.name}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        Live sync active
                      </span>
                      <span>•</span>
                      <span className="font-mono font-bold text-slate-700">
                        {src.count} memories
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onSelectSourceFilter(src.type);
                    onClose();
                  }}
                  className="text-xs h-8 px-3 rounded-xl text-indigo-600 hover:bg-indigo-50 cursor-pointer shrink-0"
                >
                  Filter Memories
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-slate-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="text-xs h-9 px-4 rounded-xl cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
