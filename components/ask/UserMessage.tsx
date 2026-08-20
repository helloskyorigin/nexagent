'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface UserMessageProps {
  text: string;
  timestamp?: string;
  avatarUrl?: string;
  className?: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({
  text,
  timestamp = 'Today, 9:24 AM',
  avatarUrl,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-end gap-3 my-4 animate-fadeIn select-text', className)}>
      {/* User Bubble */}
      <div className="bg-[#f0f2f8] border border-slate-200/50 rounded-2xl sm:rounded-full px-4 sm:px-5 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3 sm:gap-6 max-w-xl shadow-2xs">
        <p className="text-[13px] sm:text-sm font-medium text-slate-800 leading-snug">
          {text}
        </p>
        <span className="text-[11px] text-slate-400 font-normal shrink-0">
          {timestamp}
        </span>
      </div>

      {/* User Avatar Circle */}
      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-tr from-slate-900 to-indigo-950 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200 shadow-2xs overflow-hidden select-none">
        <span className="text-slate-100 font-bold text-xs">A</span>
      </div>
    </div>
  );
};
