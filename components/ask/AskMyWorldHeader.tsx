'use client';

import React from 'react';
import { History, LayoutGrid, Plus, Bell, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AskMyWorldHeaderProps {
  onNewConversation: () => void;
  onToggleHistory: () => void;
  onToggleContextRail: () => void;
  isContextRailOpen?: boolean;
  onOpenNotifications?: () => void;
  className?: string;
}

export const AskMyWorldHeader: React.FC<AskMyWorldHeaderProps> = ({
  onNewConversation,
  onToggleHistory,
  onToggleContextRail,
  isContextRailOpen = true,
  onOpenNotifications,
  className,
}) => {
  return (
    <header className={cn('w-full select-none space-y-4 pt-2 pb-3', className)}>
      {/* Top Utility Bar (Synced, Bell, Avatar) */}
      <div className="flex items-center justify-end gap-3">
        {/* Synced Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-2xs text-xs font-semibold text-slate-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Synced</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-600" />
        </button>

        {/* User Profile Avatar */}
        <div
          className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-900 to-indigo-950 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200 shadow-2xs cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all overflow-hidden"
          title="Aryan Mehta"
        >
          <span>A</span>
        </div>
      </div>

      {/* Main Screen Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 font-sans">
              Ask My World
            </h1>
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 fill-indigo-600/30" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Talk to your world. Get answers that matter.
          </p>
        </div>

        {/* Action Buttons: History, Context, New Chat */}
        <div className="flex items-center gap-2 shrink-0">
          {/* History Button */}
          <button
            type="button"
            onClick={onToggleHistory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
          >
            <History className="h-3.5 w-3.5 text-slate-500" />
            <span>History</span>
          </button>

          {/* Context Rail Toggle Button */}
          <button
            type="button"
            onClick={onToggleContextRail}
            className={cn(
              'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs',
              isContextRailOpen
                ? 'bg-indigo-50/70 text-indigo-600 border-indigo-200'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Context</span>
          </button>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={onNewConversation}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 ml-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
