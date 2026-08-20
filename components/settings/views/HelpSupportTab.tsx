'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Mail,
  MessageSquare,
  FileQuestion,
  ExternalLink,
  LifeBuoy,
} from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { cn } from '../../../lib/utils';

export interface HelpSupportTabProps {
  onNavigate?: (view: string) => void;
  className?: string;
}

export const HelpSupportTab: React.FC<HelpSupportTabProps> = ({
  onNavigate,
  className,
}) => {
  const { addToast } = useToast();
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    addToast({
      type: 'success',
      title: 'Feedback Received',
      description: 'Thank you for helping us improve Nexorbit!',
    });
    setFeedbackText('');
  };

  return (
    <div className={cn('space-y-6 select-none animate-fadeIn', className)}>
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-white tracking-tight">Help & Support</h2>
        <p className="text-xs text-slate-400">
          Get assistance, explore documentation, or contact the Nexorbit team.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Support Card 1 */}
        <div className="p-4 rounded-2xl bg-[#15181D] border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2.5 text-blue-400">
            <LifeBuoy className="h-4 w-4" />
            <h3 className="text-xs font-semibold text-white">Support Center</h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Access in-depth user manuals, connector configuration guides, and troubleshooting workflows.
          </p>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('support')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>Open Support Hub</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Support Card 2 */}
        <div className="p-4 rounded-2xl bg-[#15181D] border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2.5 text-blue-400">
            <Mail className="h-4 w-4" />
            <h3 className="text-xs font-semibold text-white">Direct Assistance</h3>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Need dedicated support or experiencing a workspace issue? Reach out directly to our engineering desk.
          </p>
          <a
            href="mailto:hello.skyorigin@gmail.com?subject=Nexorbit%20Support%20Inquiry"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181c26] hover:bg-[#1e2330] border border-slate-800 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <span>hello.skyorigin@gmail.com</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Quick Feedback Form */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#15181D] border border-slate-800/80 space-y-3">
        <div className="flex items-center gap-2 text-slate-200">
          <MessageSquare className="h-4 w-4 text-blue-400" />
          <h3 className="text-xs font-semibold">Submit Feedback or Bug Report</h3>
        </div>
        <p className="text-[11px] text-slate-400">
          Encountering unexpected behavior or have a suggestion? Let us know.
        </p>

        <form onSubmit={handleSendFeedback} className="space-y-3 pt-1">
          <textarea
            rows={3}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Describe your feedback, request, or issue in detail..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f1118] border border-slate-800 text-xs font-medium text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!feedbackText.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
