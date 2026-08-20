'use client';

import React, { useState } from 'react';
import { Shield, Lock, Key, Grid, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { cn } from '../../../lib/utils';

export interface PrivacySecurityTabProps {
  onNavigateConnectedApps: () => void;
  className?: string;
}

export const PrivacySecurityTab: React.FC<PrivacySecurityTabProps> = ({
  onNavigateConnectedApps,
  className,
}) => {
  const { addToast } = useToast();
  const [zeroTraining, setZeroTraining] = useState(true);

  const handleZeroTrainingToggle = () => {
    const nextVal = !zeroTraining;
    setZeroTraining(nextVal);
    addToast({
      type: 'info',
      title: 'Zero-Training Policy',
      description: nextVal
        ? 'Zero-training policy active. Your data is never used to train global AI models.'
        : 'Zero-training policy modified.',
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Privacy & Security
        </h2>
        <p className="text-xs text-slate-500 font-normal">
          Manage your data isolation, permissions, and security controls.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-6 text-xs">
        {/* Zero Training Guarantee */}
        <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="text-slate-900 font-bold flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-600" />
              <span>Zero Model Training Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal">
              Your inputs, synced emails, and documents are strictly private and never used to train foundational AI models.
            </p>
          </div>

          <button
            type="button"
            onClick={handleZeroTrainingToggle}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
              zeroTraining ? 'bg-emerald-600' : 'bg-slate-200'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                zeroTraining ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
            Privacy Shortcuts
          </h4>

          <div className="divide-y divide-slate-100">
            {/* Connected Apps Shortcut */}
            <div
              onClick={onNavigateConnectedApps}
              className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 rounded-xl px-2 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Grid className="h-4 w-4 text-slate-500" />
                <div>
                  <div className="text-slate-900 font-bold">Connected Apps & Permissions</div>
                  <div className="text-[11px] text-slate-400 font-normal">Manage OAuth scopes and app access</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>

            {/* Manage Permissions */}
            <div
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'Data Permissions',
                  description: 'All 6 connected integrations are operating under read-only OAuth scopes.',
                });
              }}
              className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 rounded-xl px-2 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Key className="h-4 w-4 text-slate-500" />
                <div>
                  <div className="text-slate-900 font-bold">Manage Active Session Keys</div>
                  <div className="text-[11px] text-slate-400 font-normal">Review active browser logins and devices</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
