'use client';

import React from 'react';
import { Grid, ChevronRight, Mail, Calendar, HardDrive, BookOpen, GitBranch } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface ConnectedAppsTabProps {
  onNavigateConnectedApps?: () => void;
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const ConnectedAppsTab: React.FC<ConnectedAppsTabProps> = ({
  onNavigateConnectedApps,
  onNavigate,
  className,
}) => {
  const handleNav = () => {
    if (onNavigateConnectedApps) {
      onNavigateConnectedApps();
    } else if (onNavigate) {
      onNavigate('connected-apps');
    }
  };
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Connected Apps
        </h2>
        <p className="text-xs text-slate-500 font-normal">
          Manage services connected to Nexorbit.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-6 text-xs">
        {/* App Icons Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Active Connectors</h3>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-10 w-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-2xs">
              <Mail className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
              <HardDrive className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs font-serif font-bold">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center justify-center shadow-2xs">
              <GitBranch className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* CTA Box */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-900">
              Manage Connected Apps & Integrations
            </h4>
            <p className="text-[11px] text-slate-500 font-normal">
              Connect Gmail, Google Calendar, Notion, Google Drive, or GitHub to Nexorbit.
            </p>
          </div>

          <button
            onClick={handleNav}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <span>Manage Connections</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
