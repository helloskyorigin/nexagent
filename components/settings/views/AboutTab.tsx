'use client';

import React, { useState } from 'react';
import {
  Info,
  ShieldCheck,
  Cpu,
  Database,
  FileText,
  Lock,
} from 'lucide-react';
import { Nexorbit_CONFIG } from '../../../config';
import { TermsModal } from '../modals/TermsModal';
import { PrivacyModal } from '../modals/PrivacyModal';
import { cn } from '../../../lib/utils';

export interface AboutTabProps {
  className?: string;
}

export const AboutTab: React.FC<AboutTabProps> = ({ className }) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <div className={cn('space-y-6 select-none animate-fadeIn', className)}>
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-white tracking-tight">About Nexorbit</h2>
        <p className="text-xs text-slate-400">
          Architecture overview, version information, and platform credentials.
        </p>
      </div>

      {/* Brand & Version Card */}
      <div className="p-5 rounded-2xl bg-[#15181D] border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center h-10 w-10 shrink-0 bg-blue-600/10 rounded-xl border border-blue-500/20">
            <svg viewBox="0 0 36 36" fill="none" className="h-7 w-7 text-blue-500">
              <ellipse cx="18" cy="18" rx="14" ry="7" stroke="currentColor" strokeWidth="2.5" className="transform -rotate-45 origin-center" />
              <circle cx="18" cy="18" r="4.5" fill="white" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">
                Nexorbit
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono font-semibold">
                v{Nexorbit_CONFIG.version}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {Nexorbit_CONFIG.tagline}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          Nexorbit is your AI operating system and unified cognitive workspace, designed for real-time intelligence, automated agent task routing, and deep contextual memory.
        </p>

        {/* System Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0f1118] border border-slate-800/50">
            <Cpu className="h-4 w-4 text-blue-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Core AI Engine
              </div>
              <div className="text-xs font-medium text-slate-200">
                Google GenAI Gemini 2.5
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0f1118] border border-slate-800/50">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                System Status
              </div>
              <div className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Policy Links */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => setIsTermsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#15181D] hover:bg-[#181c26] border border-slate-800 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
        >
          <FileText className="h-3.5 w-3.5 text-slate-400" />
          <span>Terms of Service</span>
        </button>

        <button
          type="button"
          onClick={() => setIsPrivacyOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#15181D] hover:bg-[#181c26] border border-slate-800 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
        >
          <Lock className="h-3.5 w-3.5 text-slate-400" />
          <span>Privacy Policy</span>
        </button>
      </div>

      {/* Modals */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
};
