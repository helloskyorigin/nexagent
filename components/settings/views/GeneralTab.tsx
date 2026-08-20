'use client';

import React from 'react';
import { Globe, Clock, Calendar, Layout, ChevronRight } from 'lucide-react';
import { GeneralPreferences } from '../types';
import { cn } from '../../../lib/utils';

export interface GeneralTabProps {
  preferences: GeneralPreferences;
  onChange: (updated: Partial<GeneralPreferences>) => void;
  className?: string;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
  preferences,
  onChange,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          General
        </h2>
        <p className="text-xs text-slate-500 font-normal">
          Manage language, timezone, date format, and startup preferences.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs divide-y divide-slate-100 text-xs">
        {/* Language */}
        <div className="py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-700 font-medium">
            <Globe className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-slate-900 font-bold">Language</div>
              <div className="text-[11px] text-slate-400 font-normal">Select system interface language</div>
            </div>
          </div>
          <select
            value={preferences.language}
            onChange={(e) => onChange({ language: e.target.value })}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Japanese">Japanese</option>
          </select>
        </div>

        {/* Timezone */}
        <div className="py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-700 font-medium">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-slate-900 font-bold">Time Zone</div>
              <div className="text-[11px] text-slate-400 font-normal">Used for meeting reminders and logs</div>
            </div>
          </div>
          <select
            value={preferences.timezone}
            onChange={(e) => onChange({ timezone: e.target.value })}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="(GMT+05:30) Asia/Kolkata">(GMT+05:30) Asia/Kolkata</option>
            <option value="(GMT-08:00) America/Los_Angeles">(GMT-08:00) Pacific Time</option>
            <option value="(GMT-05:00) America/New_York">(GMT-05:00) Eastern Time</option>
            <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
            <option value="(GMT+01:00) Europe/London">(GMT+01:00) London</option>
          </select>
        </div>

        {/* Date Format */}
        <div className="py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-700 font-medium">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-slate-900 font-bold">Date Format</div>
              <div className="text-[11px] text-slate-400 font-normal">System date representation style</div>
            </div>
          </div>
          <select
            value={preferences.dateFormat}
            onChange={(e) => onChange({ dateFormat: e.target.value })}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="MMM D, YYYY">MMM D, YYYY (e.g. May 11, 2024)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 11/05/2024)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2024-05-11)</option>
          </select>
        </div>

        {/* Startup View */}
        <div className="py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-700 font-medium">
            <Layout className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-slate-900 font-bold">Default Startup View</div>
              <div className="text-[11px] text-slate-400 font-normal">Initial screen when Nexorbit opens</div>
            </div>
          </div>
          <select
            value={preferences.startupView}
            onChange={(e) => onChange({ startupView: e.target.value as any })}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="clean-my-day">Clean My Day</option>
            <option value="home">Home Dashboard</option>
            <option value="chat">Ask My World</option>
            <option value="memory">Memory</option>
          </select>
        </div>
      </div>
    </div>
  );
};
