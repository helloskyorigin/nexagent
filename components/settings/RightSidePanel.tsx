'use client';

import React from 'react';
import {
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Upload,
  Download,
  Trash2,
  LogOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface RightSidePanelProps {
  onManageSecurity?: () => void;
  onManageStorage?: () => void;
  onExportData?: () => void;
  onDownloadData?: () => void;
  onDeleteAccount?: () => void;
  onNavigateSupport?: () => void;
  onSignOut?: () => void;
  className?: string;
}

export const RightSidePanel: React.FC<RightSidePanelProps> = ({
  onManageSecurity,
  onManageStorage,
  onExportData,
  onDownloadData,
  onDeleteAccount,
  onNavigateSupport,
  onSignOut,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* 1. Account Security Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase font-sans">
            Account Security
          </h3>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/80">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <div>
            <div className="text-xs font-bold text-emerald-950 leading-none">
              Your account is secure
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Last checked today, 9:30 AM
            </div>
          </div>
        </div>

        <button
          onClick={onManageSecurity}
          className="w-full py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
        >
          Manage Security
        </button>
      </div>

      {/* 2. Data Storage Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase font-sans">
          Data Storage
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-900 font-bold">2.4 GB <span className="text-slate-500 font-normal">/ 10 GB</span></span>
            <span className="text-slate-500 font-semibold text-[11px]">24%</span>
          </div>

          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: '24%' }}
            />
          </div>
        </div>

        <button
          onClick={onManageStorage}
          className="w-full py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
        >
          Manage Storage
        </button>
      </div>

      {/* 3. Quick Actions Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase font-sans">
          Quick Actions
        </h3>

        <div className="space-y-1">
          {/* Export My Data */}
          <button
            onClick={onExportData}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Upload className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
              <span>Export My Data</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
          </button>

          {/* Download My Data */}
          <button
            onClick={onDownloadData}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Download className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
              <span>Download My Data</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
          </button>

          {/* Sign Out Option */}
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors text-xs font-medium cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-slate-700 group-hover:text-rose-600">
                <LogOut className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-500" />
                <span className="font-medium">Sign Out</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-600" />
            </button>
          )}
        </div>

        {/* Separated Destructive Action */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={onDeleteAccount}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-colors text-xs font-medium cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-rose-600">
              <Trash2 className="h-3.5 w-3.5 text-rose-500" />
              <span className="font-semibold">Delete Account</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-rose-400 group-hover:text-rose-600" />
          </button>
        </div>
      </div>

      {/* 4. Need Help Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5">
        <div>
          <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase font-sans">
            Need Help?
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Visit our Help Center for guides, documentation, and support.
          </p>
        </div>

        <button
          onClick={onNavigateSupport}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
        >
          <span>Go to Support</span>
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

