'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, Sliders } from 'lucide-react';
import { Button } from '../ui/Button';

export interface PrivacyPanelProps {
  onManagePermissionsClick: () => void;
}

export const PrivacyPanel: React.FC<PrivacyPanelProps> = ({
  onManagePermissionsClick,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Privacy, Sovereignty &amp; Control
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              How Nexorbit protects and isolates your personal knowledge
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onManagePermissionsClick}
          className="bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 text-xs font-semibold h-8 rounded-xl shrink-0 self-start sm:self-auto cursor-pointer"
          leftIcon={<Sliders className="h-3.5 w-3.5 text-slate-500" />}
        >
          Manage Data Permissions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Lock className="h-4 w-4 text-indigo-600" />
            <span>End-to-End Encrypted</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            All stored context vectors and API tokens are encrypted with AES-256 and transmitted over TLS 1.3.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <EyeOff className="h-4 w-4 text-emerald-600" />
            <span>No AI Training</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Your emails, calendar, and notes are never used to train public LLMs or exported outside your sandbox.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Server className="h-4 w-4 text-blue-600" />
            <span>Instant Revocation</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Disconnect any app anytime. Ingestion stops immediately and memory embeddings are purged on request.
          </p>
        </div>
      </div>
    </div>
  );
};
