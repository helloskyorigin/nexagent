'use client';

import React from 'react';
import { Code2, LogOut, Trash2, Shield, Activity } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface AdvancedTabProps {
  nexorbitId: string;
  onSignOut: () => void;
  onDeleteAccount: () => void;
  className?: string;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({
  nexorbitId,
  onSignOut,
  onDeleteAccount,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Advanced
        </h2>
        <p className="text-xs text-slate-500 font-normal">
          Diagnostic details and account management actions.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-6 text-xs">
        {/* System Diagnostics */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span>Diagnostic & Session Info</span>
          </h3>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Account ID</span>
              <span className="font-mono text-slate-800 font-semibold">{nexorbitId}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Build Version</span>
              <span className="font-mono text-slate-800 font-semibold">2.0.4-release</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Session Status</span>
              <span className="text-emerald-600 font-semibold">Authenticated</span>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Account Actions</h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onSignOut}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-slate-500" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={onDeleteAccount}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <Trash2 className="h-4 w-4 text-rose-600" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
