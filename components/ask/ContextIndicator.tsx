'use client';

import React, { useState } from 'react';
import { Mail, Calendar, HardDrive, Info, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/utils';

export interface ContextIndicatorProps {
  className?: string;
}

export const ContextIndicator: React.FC<ContextIndicatorProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={cn('flex items-center gap-2 text-[11px] text-slate-500', className)}>
        <span className="font-medium">Using context from:</span>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200/80 text-[11px] font-semibold text-slate-700 transition-colors"
        >
          <Mail className="h-3 w-3 text-red-500" />
          <Calendar className="h-3 w-3 text-blue-500" />
          <HardDrive className="h-3 w-3 text-amber-500" />
          <span>3 Sources Active</span>
          <Info className="h-3 w-3 text-slate-400 ml-0.5" />
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Connected Workspace Context"
        description="Nexorbit Active Retrieval Scope"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Nexorbit evaluates relevance across all your connected workspace applications in real time without sending raw data to external servers.
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-red-500" />
                <div>
                  <span className="font-bold text-slate-900 block">Gmail</span>
                  <span className="text-[10px] text-slate-500">Emails, threads &amp; attachments</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Connected
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div>
                  <span className="font-bold text-slate-900 block">Google Calendar</span>
                  <span className="text-[10px] text-slate-500">Events, syncs &amp; invitees</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Connected
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HardDrive className="h-4 w-4 text-amber-500" />
                <div>
                  <span className="font-bold text-slate-900 block">Google Drive</span>
                  <span className="text-[10px] text-slate-500">Docs, specs &amp; proposal files</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Connected
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
