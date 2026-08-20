'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  ExternalLink, 
  MessageSquareShare, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Calendar as CalendarIcon,
  Mail,
  HardDrive
} from 'lucide-react';
import { ChangeFeedItem } from './types';
import { SourceIcon } from './SourceIcon';
import { cn } from '../../lib/utils';
import Image from 'next/image';

export interface ChangeDetailDrawerProps {
  item: ChangeFeedItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAskNexorbit?: (item: ChangeFeedItem) => void;
}

export const ChangeDetailDrawer: React.FC<ChangeDetailDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onAskNexorbit,
}) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200/80"
            >
              {/* Drawer Top Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-white border border-slate-200/60 shadow-2xs flex items-center justify-center">
                    <SourceIcon type={item.sourceId} className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800">
                      {item.sourceName}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Title & Importance */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {item.importance === 'important' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                        High Priority Change
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-medium">
                      {item.timeSection}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                    {item.contextSubtitle}
                  </p>
                </div>

                {/* Person details if present */}
                {item.personName && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                    {item.personAvatar && (
                      <div className="relative h-9 w-9 rounded-full overflow-hidden ring-2 ring-white shrink-0">
                        <Image
                          src={item.personAvatar}
                          alt={item.personName}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {item.personName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        Active participant in this signal
                      </div>
                    </div>
                  </div>
                )}

                {/* WHAT CHANGED */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    What Changed
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-800 leading-relaxed font-medium">
                    {item.whatChanged}
                  </div>
                </div>

                {/* WHY IT MATTERS (AI SYNTHESIS) */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Why It Matters
                  </div>
                  <div className="p-4 bg-indigo-50/70 border border-indigo-100/90 rounded-xl text-xs text-slate-800 leading-relaxed space-y-2">
                    <p className="font-normal">{item.whyItMatters}</p>
                    <div className="pt-2 border-t border-indigo-100/80 flex items-center gap-1.5 text-[11px] text-indigo-700 font-semibold">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Synthesized from {item.relatedContext.length + 1} cross-app data sources</span>
                    </div>
                  </div>
                </div>

                {/* RELATED SOURCES & CONTEXT */}
                {item.relatedContext && item.relatedContext.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Connected Evidence
                    </div>
                    <div className="space-y-2">
                      {item.relatedContext.map((ctx, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                              <SourceIcon type={ctx.sourceId} className="h-3.5 w-3.5" />
                              <span>{ctx.title}</span>
                            </div>
                            {ctx.timestamp && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {ctx.timestamp}
                              </span>
                            )}
                          </div>
                          {ctx.snippet && (
                            <p className="text-slate-500 text-[11px] leading-relaxed italic">
                              {ctx.snippet}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
                {item.recommendedAction && (
                  <button
                    onClick={() => {
                      onClose();
                      if (onAskNexorbit) onAskNexorbit(item);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{item.recommendedAction.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    onClose();
                    if (onAskNexorbit) onAskNexorbit(item);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
                >
                  <MessageSquareShare className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Ask Nexorbit about this change</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
