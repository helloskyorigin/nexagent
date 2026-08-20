'use client';

import React from 'react';
import {
  Mail,
  Calendar,
  FileText,
  HardDrive,
  Users,
  Star,
  MessageSquare,
  Sparkles,
  Zap,
  Bookmark,
} from 'lucide-react';
import { MemorySourceType } from './types';
import { cn } from '../../lib/utils';

export interface MemorySourceIconProps {
  type: MemorySourceType;
  name?: string;
  className?: string;
}

export const MemorySourceIcon: React.FC<MemorySourceIconProps> = ({
  type,
  name,
  className = 'h-8 w-8',
}) => {
  switch (type) {
    case 'gmail':
      return (
        <div
          className={cn(
            'rounded-xl flex items-center justify-center bg-red-50 text-red-600 border border-red-100 shrink-0 font-bold',
            className
          )}
          title="Gmail"
        >
          {/* Custom Stylized Gmail 'M' */}
          <span className="text-sm font-extrabold text-[#EA4335]">M</span>
        </div>
      );

    case 'calendar':
      return (
        <div
          className={cn(
            'rounded-xl flex items-center justify-center bg-blue-50 border border-blue-100 shrink-0 text-blue-600 font-bold',
            className
          )}
          title="Google Calendar"
        >
          <div className="flex flex-col items-center justify-center leading-none">
            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">
              31
            </span>
          </div>
        </div>
      );

    case 'notion':
      return (
        <div
          className={cn(
            'rounded-xl flex items-center justify-center bg-slate-100 text-slate-800 border border-slate-200 shrink-0 font-bold',
            className
          )}
          title="Notion"
        >
          <span className="text-sm font-black font-serif">N</span>
        </div>
      );

    case 'drive':
      return (
        <div
          className={cn(
            'rounded-xl flex items-center justify-center bg-amber-50/80 border border-amber-100 shrink-0 text-amber-600',
            className
          )}
          title="Google Drive"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M4.5 15.5L8.5 8.5H19.5L15.5 15.5H4.5Z"
              fill="#FFBA00"
            />
            <path
              d="M15.5 15.5L19.5 8.5L15.5 1.5L11.5 8.5L15.5 15.5Z"
              fill="#2684FC"
            />
            <path
              d="M8.5 8.5L4.5 15.5L0.5 22.5L4.5 22.5L8.5 15.5L8.5 8.5Z"
              fill="#00AC47"
            />
          </svg>
        </div>
      );

    case 'meeting':
      return (
        <div
          className={cn(
            'rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0',
            className
          )}
          title="Meeting"
        >
          <Users className="h-4 w-4 text-emerald-600" />
        </div>
      );

    case 'decision':
      return (
        <div
          className={cn(
            'rounded-xl flex items-center justify-center bg-amber-50 text-amber-500 border border-amber-100 shrink-0',
            className
          )}
          title="Decision"
        >
          <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
        </div>
      );

    case 'slack':
      return (
        <div
          className={cn(
            'rounded-xl flex items-center justify-center bg-purple-50 text-purple-600 border border-purple-100 shrink-0 font-bold',
            className
          )}
          title="Slack"
        >
          <MessageSquare className="h-4 w-4 text-purple-600" />
        </div>
      );

    case 'note':
    case 'manual':
    default:
      return (
        <div
          className={cn(
            'rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0',
            className
          )}
          title={name || 'Memory Synapse'}
        >
          <Sparkles className="h-4 w-4 text-indigo-600" />
        </div>
      );
  }
};
