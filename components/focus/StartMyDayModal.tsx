'use client';

import React from 'react';
import { Sparkles, Play, X, Calendar, Video, Clock, CheckCircle2 } from 'lucide-react';

export interface StartMyDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: () => void;
}

export const StartMyDayModal: React.FC<StartMyDayModalProps> = ({
  isOpen,
  onClose,
  onStartSession,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-6 z-10 animate-in zoom-in-95 duration-200 text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Play className="h-4 w-4 fill-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Start My Day</h2>
              <p className="text-xs text-slate-600">Guided focus session</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Ready announcement */}
        <div className="my-5 p-4 rounded-xl bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/40 border border-indigo-100/80">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>You&apos;re ready, Aryan.</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Nexorbit has cleared low-priority interruptions and aligned your morning focus block.
          </p>
        </div>

        {/* First step spotlight */}
        <div className="p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/20 mb-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            First High-Impact Item
          </span>
          <div className="flex items-start gap-3 mt-2">
            <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Project Alpha Sync</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                9:30 AM (30m) • Google Calendar
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-indigo-700 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>4 stakeholders confirmed • Notes pre-linked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
          >
            Not now
          </button>
          <button
            onClick={() => {
              onStartSession();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-98"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Start Focus Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
