'use client';

import React from 'react';
import { Pencil, ChevronRight, User, Mail, Globe, Clock, LogOut } from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../../../lib/utils';

export interface ProfileTabProps {
  user: UserProfile;
  onEditProfile: () => void;
  onViewPlans: () => void;
  onSignOut?: () => void;
  className?: string;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  onEditProfile,
  onViewPlans,
  onSignOut,
  className,
}) => {
  const initialLetter = user.name ? user.name.charAt(0).toUpperCase() : 'S';

  return (
    <div className={cn('space-y-5', className)}>
      {/* Section Title */}
      <div className="space-y-0.5">
        <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
          Profile
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Main Profile Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        {/* Top Header Row with Avatar & Edit Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            {/* Circle Avatar */}
            <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-base font-bold shadow-2xs shrink-0 select-none">
              {initialLetter}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {user.name}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {user.email}
              </p>
              <div className="pt-0.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-indigo-50 text-indigo-700 border border-indigo-100/80">
                  {user.plan}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onEditProfile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer shrink-0 self-start sm:self-center"
          >
            <Pencil className="h-3.5 w-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Useful Account Information Rows */}
        <div className="divide-y divide-slate-100 text-xs">
          {/* Full Name */}
          <div
            onClick={onEditProfile}
            className="h-11 px-2.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-slate-500 font-medium w-28 shrink-0">
              <User className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">Full Name</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-semibold min-w-0 justify-end flex-1">
              <span className="truncate">{user.name}</span>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </div>
          </div>

          {/* Email */}
          <div
            onClick={onEditProfile}
            className="h-11 px-2.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-slate-500 font-medium w-28 shrink-0">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">Email</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-semibold min-w-0 justify-end flex-1">
              <span className="truncate">{user.email}</span>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </div>
          </div>

          {/* Time Zone */}
          <div
            onClick={onEditProfile}
            className="h-11 px-2.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-slate-500 font-medium w-28 shrink-0">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">Time Zone</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-semibold min-w-0 justify-end flex-1">
              <span className="truncate">{user.timezone || '(GMT+05:30) Asia/Kolkata'}</span>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </div>
          </div>

          {/* Language */}
          <div
            onClick={onEditProfile}
            className="h-11 px-2.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-slate-500 font-medium w-28 shrink-0">
              <Globe className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="truncate">Language</span>
            </div>
            <div className="flex items-center gap-2 text-slate-900 font-semibold min-w-0 justify-end flex-1">
              <span className="truncate">{user.language || 'English'}</span>
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
            </div>
          </div>
        </div>

        {/* Low-prominence Account Details area */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>ID: <code className="font-mono text-slate-500">{user.nexorbitId || 'nxo_7f3a9b2c1d4e'}</code></span>
          <span>Joined {user.memberSince || 'May 2024'}</span>
        </div>
      </div>

      {/* Subscription Card Section */}
      <div className="space-y-2.5 pt-1">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">
            Subscription
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            You are on the {user.plan}.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900">
              {user.plan}
            </h4>
            <p className="text-xs text-slate-500 font-normal">
              Standard workspace access and daily limits.
            </p>
          </div>

          <button
            onClick={onViewPlans}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors shrink-0 cursor-pointer self-start sm:self-center"
          >
            <span>View Plans</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Account Session & Sign Out Card */}
      {onSignOut && (
        <div className="space-y-2.5 pt-1">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">
              Account Session
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Safely sign out from this device and return to login.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900">
                Active Session
              </h4>
              <p className="text-xs text-slate-500 font-normal">
                Signed in as {user.email || user.name}
              </p>
            </div>

            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold text-xs transition-colors shrink-0 cursor-pointer self-start sm:self-center"
            >
              <LogOut className="h-4 w-4 text-rose-600" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

