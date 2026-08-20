'use client';

import React from 'react';
import { Search, Mail, FileText, Calendar, Code, LayoutGrid } from 'lucide-react';

export const CAPABILITIES_DATA = [
  {
    title: 'Research',
    description: 'Search, analyze and summarize information.',
    icon: Search,
  },
  {
    title: 'Email',
    description: 'Find, summarize and organize important messages.',
    icon: Mail,
  },
  {
    title: 'Files',
    description: 'Find, read and organize documents.',
    icon: FileText,
  },
  {
    title: 'Calendar',
    description: 'Understand schedules and coordinate work.',
    icon: Calendar,
  },
  {
    title: 'Code',
    description: 'Work with repositories, issues and code.',
    icon: Code,
  },
  {
    title: 'Workspace',
    description: 'Combine information across connected tools.',
    icon: LayoutGrid,
  },
];

export const CapabilitiesSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">
          What Nexorbit can do
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Turn connected tools into useful work.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {CAPABILITIES_DATA.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.title}
              className="bg-[#15181D] border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition-all group"
            >
              <div className="h-8 w-8 rounded-xl bg-[#0D0F12] border border-slate-800 flex items-center justify-center text-blue-400">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                  {cap.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  {cap.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
