'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Calendar as CalendarIcon, 
  FileText, 
  CheckSquare, 
  AtSign, 
  Code, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageSquareShare,
  X
} from 'lucide-react';
import { ChangeFeedItem } from './types';
import { SourceIcon } from './SourceIcon';
import { cn } from '../../lib/utils';
import Image from 'next/image';

export interface ChangeRowProps {
  item: ChangeFeedItem;
  onOpenDetailDrawer?: (item: ChangeFeedItem) => void;
  onAskNexorbit?: (item: ChangeFeedItem) => void;
  onToggleRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export const ChangeRow: React.FC<ChangeRowProps> = ({
  item,
  onOpenDetailDrawer,
  onAskNexorbit,
  onToggleRead,
  onDismiss,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isImportant = item.importance === 'important';

  const handleRowClick = (e: React.MouseEvent) => {
    // Avoid expanding if clicking a direct action button specifically
    if ((e.target as HTMLElement).closest('button.direct-action')) return;
    setIsExpanded((prev) => !prev);
    if (!item.isRead && onToggleRead) {
      onToggleRead(item.id);
    }
  };

  return (
    <div
      id={`change-item-${item.id}`}
      onClick={handleRowClick}
      className={cn(
        "group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden",
        isImportant
          ? "border-indigo-200/90 shadow-[0_2px_10px_rgba(79,70,229,0.05)] ring-1 ring-indigo-500/15"
          : "border-slate-200/80 hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-2xs",
        isExpanded && "border-indigo-300 shadow-md"
      )}
    >
      {/* Subtle Unread Bar */}
      {!item.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
      )}

      {/* Main Row Content */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3 sm:gap-4">
        {/* Source Icon on Left */}
        <div className="relative shrink-0 mt-0.5">
          <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-2xs">
            <SourceIcon type={item.sourceId} className="h-5 w-5" />
          </div>
          {!item.isRead && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-indigo-600 ring-2 ring-white" />
          )}
        </div>

        {/* Center Text Details */}
        <div className="flex-1 min-w-0 pr-2">
          {/* Header Row: Title & Important Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
              {item.title}
            </h3>
            {isImportant && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <Sparkles className="h-2.5 w-2.5 text-indigo-600" />
                <span>Important</span>
              </span>
            )}
          </div>

          {/* One-line Context */}
          <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-1 leading-relaxed">
            {item.contextSubtitle}
          </p>

          {/* Source Name + Timestamp formatted as 'Google Calendar · 9:41 AM' */}
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 font-medium">
            <span>{item.sourceName}</span>
            <span>·</span>
            <span>{item.timestamp}</span>
          </div>
        </div>

        {/* Right Action Affordance & Arrow */}
        <div className="flex items-center gap-3 shrink-0 pt-0.5">
          {item.personAvatar ? (
            <div className="relative h-7 w-7 rounded-full overflow-hidden ring-1 ring-slate-200 shrink-0 hidden sm:block">
              <Image
                src={item.personAvatar}
                alt={item.personName || 'User'}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : null}

          {/* Dismiss Button */}
          {onDismiss && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(item.id);
              }}
              className="direct-action h-8 w-8 rounded-full hover:bg-rose-50 border border-transparent hover:border-rose-100 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              title="Dismiss Change"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Arrow Affordance */}
          <div className="h-8 w-8 rounded-full bg-slate-50 group-hover:bg-indigo-50 border border-slate-200/60 group-hover:border-indigo-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>

      {/* AI Interpretation Accordion (Revealed on click) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="border-t border-slate-100 bg-slate-50/60"
          >
            <div className="p-4 sm:p-5 space-y-3.5 text-xs">
              {/* WHAT CHANGED */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  WHAT CHANGED
                </div>
                <p className="text-slate-800 text-[13px] leading-relaxed font-medium">
                  {item.whatChanged}
                </p>
              </div>

              {/* WHY IT MATTERS */}
              <div className="space-y-1 bg-white rounded-xl p-3.5 border border-indigo-100/90 shadow-2xs">
                <div className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  WHY IT MATTERS
                </div>
                <p className="text-slate-700 text-[12.5px] leading-relaxed font-normal">
                  {item.whyItMatters}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  {item.recommendedAction && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenDetailDrawer) onOpenDetailDrawer(item);
                      }}
                      className="direct-action flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <span>{item.recommendedAction.label}</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenDetailDrawer) onOpenDetailDrawer(item);
                    }}
                    className="direct-action flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>View details</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" />
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAskNexorbit) onAskNexorbit(item);
                  }}
                  className="direct-action flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  <MessageSquareShare className="h-3.5 w-3.5" />
                  <span>Ask Nexorbit →</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
