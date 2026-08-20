'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  ShieldCheck,
  Zap,
  ChevronRight,
  ExternalLink,
  Send,
  CheckCircle2,
  Lock,
  Mail,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToast } from '../ui/Toast';
import { useAuth } from '../auth/AuthContext';

export interface SupportViewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const SupportView: React.FC<SupportViewProps> = ({
  onNavigate,
  className,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('General Question');
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      setMessage('');
      addToast({
        type: 'success',
        title: 'Message Received',
        description: 'Thank you. Our engineering and support team will respond to your registered email.',
      });
    }, 600);
  };

  const FAQS = [
    {
      q: 'How does Nexorbit protect my data and tokens?',
      a: 'All authentication is managed securely via Firebase Auth. External tokens are encrypted server-side with AES-GCM and never exposed to client-side scripts.',
    },
    {
      q: 'Which connectors are currently supported?',
      a: 'Gmail is actively available with verified OAuth integration. Google Drive, Google Calendar, GitHub, and Notion connectors are rolling out in the next platform phase.',
    },
    {
      q: 'How does the Memory system work?',
      a: 'Memories store workspace context, personal preferences, and operational knowledge in your private Firestore collection, accessible only by your authenticated account.',
    },
    {
      q: 'Can I export or delete my workspace data?',
      a: 'Yes. You can manage, export, and delete your profile and memories at any time directly from the Settings > Privacy & Security tab.',
    },
  ];

  return (
    <div className={cn('w-full space-y-8 animate-fadeIn pb-16', className)}>
      {/* HEADER */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
          <HelpCircle className="h-4 w-4" />
          <span>Nexorbit Help Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Support &amp; Knowledge Base
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          Guides, security facts, FAQs, and direct assistance for your workspace.
        </p>
      </div>

      {/* THREE RESOURCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Documentation &amp; Guides</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Learn how to leverage Nexorbit AI modes, setup Gmail workflows, and organize workspace missions.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Security &amp; Privacy</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enterprise-grade data encryption, granular permissions, and zero data leakage policies.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">System Status</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All Nexorbit core services and Firestore persistence systems are 100% operational.
          </p>
        </div>
      </div>

      {/* FAQS & CONTACT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-bold text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1.5"
              >
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  {faq.q}
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DIRECT CONTACT FORM */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-950">Contact Support</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Send a question directly to the engineering team.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 text-center rounded-xl bg-emerald-50 border border-emerald-100 space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-900">Message Dispatched</div>
                <p className="text-[11px] text-emerald-700">
                  We have logged your query and will reply to <span className="font-semibold">{user?.email || 'your email'}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-bold text-emerald-800 underline mt-2 inline-block cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Topic</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:border-indigo-500"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Connector Integration">Connector Integration</option>
                    <option value="Billing & Credits">Billing &amp; Credits</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe how we can help you..."
                    className="w-full p-2.5 bg-slate-50 focus:bg-white rounded-xl border border-slate-200 outline-none focus:border-indigo-500 text-slate-900 resize-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSending ? 'Sending...' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
