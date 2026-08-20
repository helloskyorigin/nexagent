'use client';

import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#121520] border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Security & Data Privacy
              </h2>
              <p className="text-xs text-slate-400">
                How Nexorbit protects your workspace credentials
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Pillars */}
        <div className="py-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#161a25] border border-slate-800/60">
            <EyeOff className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-white">Zero Model Training</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Your private workspace data, emails, documents, and messages are never used to train or fine-tune AI foundation models.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#161a25] border border-slate-800/60">
            <KeyRound className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-white">OAuth 2.0 Least-Privilege</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Nexorbit requests only read-only or draft permissions necessary to complete delegated tasks. Password credentials are never touched.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#161a25] border border-slate-800/60">
            <Lock className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-white">AES-256 Storage & Encryption</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                All synchronization tokens are encrypted at rest using industry-standard AES-256 and transmitted exclusively over HTTPS/TLS.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#161a25] border border-slate-800/60">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-white">Instant One-Click Revocation</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                You can disconnect any plugin at any time from this screen. Revocation takes effect instantly across all Nexorbit services.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
};
