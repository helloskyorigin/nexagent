'use client';

import React from 'react';
import { ArrowRight, Mail, Calendar, HardDrive, BookOpen, MessageSquare, GitBranch, Layers } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface ConnectedAppsCardProps {
  onManageClick: () => void;
  className?: string;
}

export const ConnectedAppsCard: React.FC<ConnectedAppsCardProps> = ({
  onManageClick,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] transition-all space-y-4',
        className
      )}
    >
      <div className="space-y-0.5">
        <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
          Connected Apps
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Manage your connected apps and data access.
        </p>
      </div>

      {/* App Icons Row */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        {/* Gmail */}
        <div className="h-9 w-9 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 shadow-2xs">
          <Mail className="h-4 w-4" />
        </div>

        {/* Google Calendar */}
        <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs">
          <Calendar className="h-4 w-4" />
        </div>

        {/* Google Drive */}
        <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-2xs">
          <HardDrive className="h-4 w-4" />
        </div>

        {/* Notion */}
        <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-2xs font-serif font-bold text-xs">
          <BookOpen className="h-4 w-4" />
        </div>

        {/* Slack */}
        <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-2xs">
          <MessageSquare className="h-4 w-4" />
        </div>

        {/* GitHub */}
        <div className="h-9 w-9 rounded-xl bg-slate-900 text-white border border-slate-800 flex items-center justify-center shadow-2xs">
          <GitBranch className="h-4 w-4" />
        </div>

        {/* +2 Badge */}
        <div className="h-9 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-600 dark:text-slate-400 shadow-2xs">
          +2
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={onManageClick}
          className="w-full flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-1 transition-colors cursor-pointer group"
        >
          <span>Manage Connected Apps</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
