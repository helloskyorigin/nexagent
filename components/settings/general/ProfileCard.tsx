'use client';

import React from 'react';
import { Pencil } from 'lucide-react';
import { UserProfile } from '../types';
import { Button } from '../../ui/Button';
import { cn } from '../../../lib/utils';

export interface ProfileCardProps {
  user: UserProfile;
  onEditProfile: () => void;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onEditProfile,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] transition-all space-y-4',
        className
      )}
    >
      {/* Header with Title and Edit Profile CTA */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white tracking-tight">
            Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Update your personal information and how Nexorbit refers to you.
          </p>
        </div>

        <button
          onClick={onEditProfile}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/50 dark:bg-indigo-950/40 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <Pencil className="h-3 w-3" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Main Profile Info Row */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              {user.name}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 pt-0.5">
              {user.role}
            </p>
          </div>
        </div>

        {/* Right: Meta IDs */}
        <div className="flex sm:flex-col justify-between sm:justify-center items-start sm:items-end gap-2 text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800 shrink-0">
          <div className="text-left sm:text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block sm:inline mr-2">
              Nexorbit ID
            </span>
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {user.nexorbitId}
            </span>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 dark:text-slate-400">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mr-1.5 font-medium">
              Member since
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {user.memberSince}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
