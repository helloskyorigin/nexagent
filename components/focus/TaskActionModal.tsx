'use client';

import React from 'react';
import {
  X,
  Sparkles,
  ExternalLink,
  Calendar,
  Mail,
  FileText,
  Coffee,
  BookOpen,
  Send,
  Video,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { DailyPlanItem } from './types';
import { ConnectorIcon } from '../connectors/ConnectorIcon';

export interface TaskActionModalProps {
  item: DailyPlanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAskNexorbit: (query?: string) => void;
}

export const TaskActionModal: React.FC<TaskActionModalProps> = ({
  item,
  isOpen,
  onClose,
  onAskNexorbit,
}) => {
  if (!isOpen || !item) return null;

  const renderActionSpecificContent = () => {
    switch (item.actionType) {
      case 'join_meeting':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-800 mb-1">
                <Video className="h-4 w-4" />
                <span>Google Meet Conference Link</span>
              </div>
              <p className="text-xs text-purple-700">
                meet.google.com/nex-alph-syn
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                <Clock className="h-3.5 w-3.5" />
                <span>Starts at 9:30 AM (30 min duration)</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-900 mb-2">Meeting Agenda &amp; Attendees</h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                <li>Review Q3 roadmap milestone deliverables</li>
                <li>Discuss engineering dependency risks (PR #142)</li>
                <li>Align on client review feedback with Rahul</li>
              </ul>
            </div>
          </div>
        );

      case 'open_email':
      case 'send_email':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 mb-1">
                <Mail className="h-4 w-4" />
                <span>Gmail Thread Summary</span>
              </div>
              <p className="text-xs text-blue-900 font-medium">
                Subject: Re: Enterprise Scope &amp; Milestones
              </p>
              <p className="text-xs text-blue-700 mt-1">
                From: Rahul (Client Lead) • 2 hours ago
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50 text-xs text-slate-700 leading-relaxed">
              &quot;We reviewed the initial scope deck. Overall look solid, but we need clarity on the SLA response tier and delivery window for Phase 2.&quot;
            </div>
          </div>
        );

      case 'open_file':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
                <FileText className="h-4 w-4" />
                <span>Google Drive Document</span>
              </div>
              <p className="text-xs text-emerald-900 font-medium">
                Proposal_v2_Final.pdf (14 Pages)
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Last modified 3 hours ago by Sarah Jenkins
              </p>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed">
              Updated sections: Executive Summary, Tier 1 SLA Matrix, Pricing Structure, Appendix B Terms.
            </div>
          </div>
        );

      case 'take_break':
        return (
          <div className="space-y-4 text-center py-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Coffee className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Scheduled Mindful Recharge</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Step away from screens, hydrate, and prepare for afternoon focus sessions.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              {item.description}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-6 z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {item.sourceId && <ConnectorIcon id={item.sourceId} size="md" />}
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate max-w-[260px]">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500">
                {item.time} {item.subtitle ? `• ${item.subtitle}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="my-4">{renderActionSpecificContent()}</div>

        {/* AI Insight Reason */}
        {item.whyPrioritized && (
          <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900 mb-4">
            <div className="flex items-center gap-1.5 font-semibold text-indigo-800 mb-0.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Priority Context</span>
            </div>
            <p className="text-[11px] text-indigo-700 leading-normal">{item.whyPrioritized}</p>
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onAskNexorbit(`Tell me everything relevant about ${item.title}`);
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Ask Nexorbit →</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{item.actionLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
