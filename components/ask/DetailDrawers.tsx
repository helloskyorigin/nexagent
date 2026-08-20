'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  Mail,
  Calendar,
  FileText,
  Clock,
  Send,
  Check,
  Copy,
  Sparkles,
  Paperclip,
  Mic,
  Search,
  ExternalLink,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import { SourceItem, FindingItem, AskConversation, ContextEntity, RelatedItem } from './types';
import { SourceIcon } from './SourceIcons';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

// ==========================================
// 1. Conflict Detail Drawer
// ==========================================
export interface ConflictDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onPrepareResponse: () => void;
  onOpenSource: (source: SourceItem) => void;
  sources: SourceItem[];
}

export const ConflictDetailDrawer: React.FC<ConflictDetailDrawerProps> = ({
  isOpen,
  onClose,
  onPrepareResponse,
  onOpenSource,
  sources,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fadeIn select-none">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight border-l border-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Deadline Conflict Analysis</h3>
              <p className="text-xs text-slate-400">Project Alpha timeline discrepancy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 flex-1">
          {/* Section: What Changed */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
              What Changed
            </span>
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
              <div className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                <span className="font-bold text-amber-700 shrink-0">Client Email (Rahul):</span>
                <span>States target delivery is <strong>Friday 5:00 PM</strong>.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                <span className="font-bold text-indigo-700 shrink-0">Calendar &amp; Brief:</span>
                <span>List review sync for <strong>Tomorrow 10:00 AM</strong> with final handoff on <strong>Monday Aug 18</strong>.</span>
              </div>
            </div>
          </div>

          {/* Section: Why It Matters */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
              Why It Matters
            </span>
            <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              If left unclarified, engineering will continue targeting Monday while Rahul expects deliverables on Friday. Resolving this before tomorrow’s 10:00 AM meeting prevents scope friction and sets clear expectations.
            </p>
          </div>

          {/* Section: Sources Involved */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
              Sources ({sources.length})
            </span>
            <div className="space-y-2">
              {sources.map((src) => (
                <div
                  key={src.id}
                  onClick={() => onOpenSource(src)}
                  className="p-3 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50/80 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SourceIcon type={src.connector} className="h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                        {src.title}
                      </p>
                      <p className="text-[11px] text-slate-400 font-normal truncate">{src.snippet}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onPrepareResponse();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer shadow-xs"
          >
            Prepare response →
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. Email Thread Drawer
// ==========================================
export interface EmailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onPrepareReply: () => void;
}

export const EmailDrawer: React.FC<EmailDrawerProps> = ({
  isOpen,
  onClose,
  onPrepareReply,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fadeIn select-none">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight border-l border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200/60">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Alpha Discussion</h3>
              <p className="text-xs text-slate-400">Gmail Thread · Rahul Mehta</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 flex-1">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-900">Rahul Mehta &lt;rahul@alpha-client.com&gt;</span>
              <span>Today, 9:15 AM</span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
              &quot;Hi Aryan, following up on our sync earlier this week. We are aiming for Friday COB to submit the final spec review before release. Let me know if everything is on track for this.&quot;
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1">
            <span className="text-[10.5px] font-bold text-indigo-600 uppercase tracking-wider block">
              Nexorbit Suggestion
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rahul is awaiting confirmation. Reply now to clarify the Monday August 18 timeline agreed in the master spec.
            </p>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onPrepareReply();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer shadow-xs"
          >
            Draft reply →
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. Meeting Detail Drawer
// ==========================================
export interface MeetingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeetingDrawer: React.FC<MeetingDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fadeIn select-none">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight border-l border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Project Alpha Sync</h3>
              <p className="text-xs text-slate-400">Google Calendar · Tomorrow, 10:00 AM</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 flex-1">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>Tomorrow, 10:00 AM – 10:30 AM (30 mins)</span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-900 block">Attendees:</span>
              <p>• Rahul Mehta (Client Lead)</p>
              <p>• Aryan Mehta (Engineering Lead)</p>
              <p>• Sarah Lin (Product Strategy)</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
              Meeting Agenda
            </span>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Review Alpha core architecture &amp; sprint progress</li>
              <li>Address deadline discrepancy between email &amp; master document</li>
              <li>Align on final delivery checklist for Monday August 18</li>
            </ul>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. Source Preview Drawer
// ==========================================
export interface SourcePreviewDrawerProps {
  source: SourceItem | null;
  onClose: () => void;
}

export const SourcePreviewDrawer: React.FC<SourcePreviewDrawerProps> = ({ source, onClose }) => {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fadeIn select-none">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight border-l border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200">
              <SourceIcon type={source.connector} className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{source.connectorName} Preview</h3>
              <p className="text-xs text-slate-400">{source.timestamp}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 flex-1">
          <div className="space-y-1">
            <span className="text-[10.5px] font-bold text-indigo-600 uppercase tracking-wider block">
              Document / Entity Title
            </span>
            <h4 className="text-sm font-bold text-slate-900">{source.title}</h4>
          </div>

          {source.sender && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">Source Author: </span>
              {source.sender}
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
              Indexed Excerpt
            </span>
            <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed p-4 rounded-2xl bg-slate-50 border border-slate-100">
              {source.snippet}
            </p>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
          >
            Close preview
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. Prepare Response Interactive Workflow Modal
// ==========================================
export interface PrepareResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrepareResponseModal: React.FC<PrepareResponseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useToast();
  const [step, setStep] = useState<'preparing' | 'ready'>('preparing');
  const [draftSubject, setDraftSubject] = useState('Re: Project Alpha Spec Review & Timeline Confirmation');
  const [draftBody, setDraftBody] = useState(
    `Hi Rahul,\n\nThanks for checking in on the spec review. I noticed in our latest discussion you mentioned aiming for Friday COB, but our master timeline brief and tomorrow's 10:00 AM sync agenda target final handoff for Monday August 18.\n\nLet's confirm the milestone dates during our meeting tomorrow so everyone stays fully aligned.\n\nBest regards,\nAryan`
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => {
        setStep('ready');
      }, 1200);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApprove = () => {
    navigator.clipboard.writeText(`Subject: ${draftSubject}\n\n${draftBody}`);
    addToast({
      type: 'success',
      title: 'Response Approved & Copied',
      description: 'Draft ready to send to Rahul.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn select-none">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/60 to-purple-50/40">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-950">
                {step === 'preparing' ? 'Preparing Response...' : 'Draft Ready for Rahul'}
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                {step === 'preparing'
                  ? 'Synthesizing context from Gmail, Calendar, and Drive...'
                  : 'Nexorbit generated a clarifying response.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {step === 'preparing' ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="h-12 w-12 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
              <p className="text-xs text-slate-500 font-medium">
                Aligning email context with Google Calendar and Project Alpha brief...
              </p>
            </div>
          ) : (
            <div className="space-y-3 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Subject
                </label>
                <input
                  type="text"
                  value={draftSubject}
                  onChange={(e) => setDraftSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Message Body
                </label>
                <textarea
                  rows={7}
                  value={draftBody}
                  onChange={(e) => setDraftBody(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed focus:bg-white focus:border-indigo-400 outline-none resize-none font-sans"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'ready' && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs transition-all cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Approve &amp; Copy Draft</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 6. Voice Recording Modal
// ==========================================
export interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitVoice: (transcript: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmitVoice,
}) => {
  const [transcript, setTranscript] = useState('Is there anything important I should know about Project Alpha?');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 text-center space-y-6 animate-scaleUp">
        {/* Pulsing Mic Visualizer */}
        <div className="relative inline-flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center animate-pulse">
            <Mic className="h-8 w-8" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-25" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-950">Listening...</h3>
          <p className="text-xs text-slate-500 font-normal">
            Speak your question naturally.
          </p>
        </div>

        {/* Live Mock Waveform */}
        <div className="flex items-center justify-center gap-1 h-8">
          {[40, 70, 90, 60, 100, 75, 45, 85, 95, 50, 80].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-indigo-600 rounded-full animate-bounce"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>

        {/* Transcript Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800 italic">
          &quot;{transcript}&quot;
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSubmitVoice(transcript);
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs cursor-pointer"
          >
            Submit prompt
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. File Attachment Picker Modal
// ==========================================
export interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachFile: (fileName: string) => void;
}

export const AttachmentModal: React.FC<AttachmentModalProps> = ({
  isOpen,
  onClose,
  onAttachFile,
}) => {
  const mockFiles = [
    { name: 'Project_Alpha_Master_Brief_v2.pdf', size: '2.4 MB', type: 'drive' },
    { name: 'Alpha_Architecture_Diagram.png', size: '1.1 MB', type: 'doc' },
    { name: 'Client_Sync_Meeting_Notes_Aug.docx', size: '480 KB', type: 'doc' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 space-y-4 animate-scaleUp">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Attach Workspace File</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          {mockFiles.map((file, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onAttachFile(file.name);
                onClose();
              }}
              className="w-full p-3 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{file.size}</p>
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. History Drawer
// ==========================================
export interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: AskConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fadeIn select-none">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInRight border-l border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Conversation History</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 flex-1">
          {/* Search bar */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-indigo-400 outline-none"
            />
          </div>

          {/* List */}
          <div className="space-y-2">
            {filtered.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onClose();
                  }}
                  className={cn(
                    'w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col space-y-1',
                    isActive
                      ? 'bg-indigo-50/70 border-indigo-200 shadow-2xs'
                      : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn('text-xs font-bold truncate', isActive ? 'text-indigo-900' : 'text-slate-900')}>
                      {conv.title}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">{conv.updatedAt}</span>
                  </div>
                  {conv.previewText && (
                    <p className="text-[11px] text-slate-500 truncate font-normal">{conv.previewText}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between sticky bottom-0">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer shadow-xs"
          >
            + Start New Conversation
          </button>
        </div>
      </div>
    </div>
  );
};
