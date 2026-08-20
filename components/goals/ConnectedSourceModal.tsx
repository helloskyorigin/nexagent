'use client';

import React from 'react';
import { X, Sparkles, ExternalLink, Calendar, Mail, HardDrive, BookOpen, GitBranch, Heart } from 'lucide-react';
import { ConnectedSource, GoalItem } from './types';
import { GoalSourceIcon } from './GoalSourceIcon';
import { Button } from '../ui/Button';

export interface ConnectedSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: ConnectedSource | null;
  goal: GoalItem | null;
}

export const ConnectedSourceModal: React.FC<ConnectedSourceModalProps> = ({
  isOpen,
  onClose,
  source,
  goal,
}) => {
  if (!isOpen || !source || !goal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden text-left z-10">
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <GoalSourceIcon type={source.type} name={source.name} className="h-8 w-8" />
            <div>
              <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                {source.name} Integration
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Synaptic Evidence
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1">
            <span className="text-xs font-bold text-indigo-900">Linked to Goal:</span>
            <div className="text-xs text-indigo-800 font-medium">{goal.title}</div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700">Source Item Details</span>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="text-sm font-semibold text-slate-900">{source.detail}</div>
              {source.snippet && (
                <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 font-mono leading-relaxed">
                  {source.snippet}
                </div>
              )}
              {source.time && (
                <div className="text-[11px] text-slate-400">Last Synced: {source.time}</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Synaptic Link
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-xs h-9 px-4 rounded-xl cursor-pointer"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
