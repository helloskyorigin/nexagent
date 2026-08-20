'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  ChevronDown, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Mail,
  Calendar as CalendarIcon,
  HardDrive
} from 'lucide-react';
import { ChangeFeedItem } from './types';
import { SourceIcon } from './SourceIcon';
import { cn } from '../../lib/utils';
import Image from 'next/image';

export interface GroupedChangeRowProps {
  item: ChangeFeedItem;
  onOpenDetailDrawer?: (item: ChangeFeedItem) => void;
  onAskNexorbit?: (item: ChangeFeedItem) => void;
}

export const GroupedChangeRow: React.FC<GroupedChangeRowProps> = ({
  item,
  onOpenDetailDrawer,
  onAskNexorbit,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      id={`grouped-change-${item.id}`}
      className={cn(
        "bg-white rounded-2xl border transition-all duration-200 overflow-hidden",
        isExpanded
          ? "border-indigo-200/80 shadow-[0_4px_16px_rgba(79,70,229,0.06)]"
          : "border-slate-100 hover:border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
      )}
    >
      {/* Header Bar of the Group */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs">
            <Layers className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                CORRELATED GROUP
              </span>
              <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">
                {item.groupProjectName || item.title}
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {item.subChanges?.length || 3} related events across Gmail, Calendar & Drive
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            {item.timestamp}
          </span>
          <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-indigo-600" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Sub-Changes List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="border-t border-slate-100 bg-slate-50/40 p-4 sm:p-5 space-y-4"
          >
            {/* AI Synthesis Callout */}
            <div className="bg-indigo-50/70 border border-indigo-100/90 rounded-xl p-3.5 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-indigo-950">AI Synthesis</div>
                <p className="text-slate-700 leading-relaxed">
                  {item.whyItMatters}
                </p>
              </div>
            </div>

            {/* Sub-changes items */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Connected Events in this group
              </div>

              {item.subChanges?.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-xl border border-slate-200/70 p-3 flex items-center justify-between gap-3 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0">
                      <SourceIcon type={sub.sourceId} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">
                        {sub.title}
                      </div>
                      <div className="text-slate-500 text-[11px] truncate">
                        {sub.contextSnippet}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {sub.personAvatar && (
                      <div className="relative h-5 w-5 rounded-full overflow-hidden ring-1 ring-slate-200 shrink-0">
                        <Image
                          src={sub.personAvatar}
                          alt={sub.personName || ''}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {sub.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions for the group */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200/60">
              <button
                onClick={() => {
                  if (onOpenDetailDrawer) onOpenDetailDrawer(item);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <span>Review group context</span>
                <ArrowRight className="h-3 w-3" />
              </button>

              <button
                onClick={() => {
                  if (onAskNexorbit) onAskNexorbit(item);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                <span>Ask Nexorbit about this group →</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
