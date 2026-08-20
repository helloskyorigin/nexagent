'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Share2,
  Calendar,
  CheckSquare,
  Globe,
  Sparkles,
} from 'lucide-react';
import { SourceReference, ChatAction, MemoryContextData } from './types';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface RightContextPanelProps {
  sources?: SourceReference[];
  actions?: ChatAction[];
  memory?: MemoryContextData;
  onNavigateToMemory?: () => void;
  onOpenSource?: (source: SourceReference) => void;
  onExecuteAction?: (action: ChatAction) => void;
  onCreateWatch?: () => void;
  className?: string;
}

export const RightContextPanel: React.FC<RightContextPanelProps> = ({
  sources = [],
  actions = [],
  memory,
  onNavigateToMemory,
  onOpenSource,
  onExecuteAction,
  onCreateWatch,
  className,
}) => {
  const { addToast } = useToast();
  const [showAllSources, setShowAllSources] = useState(false);

  const hasSources = sources && sources.length > 0;
  const hasActions = actions && actions.length > 0;
  const hasMemory = Boolean(memory && memory.text);
  const hasAnything = hasSources || hasActions || hasMemory;

  const visibleSources = showAllSources ? sources : sources.slice(0, 4);

  const getSourceIcon = (type?: string) => {
    switch (type) {
      case 'drive':
        return (
          <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M8.2 2l-6 10.4 4.1 7.1 6-10.4-4.1-7.1zm7.6 0h-8.2l4.1 7.1h8.2l-4.1-7.1zm2.3 8.3l-4.1 7.1h8.2l4.1-7.1h-8.2z" />
            </svg>
          </div>
        );
      case 'gmail':
        return (
          <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
        );
      case 'notion':
        return (
          <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0 font-serif font-bold text-xs">
            N
          </div>
        );
      default:
        return (
          <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <aside
      className={cn(
        'w-full lg:w-[280px] xl:w-[310px] shrink-0 flex flex-col space-y-6 select-none',
        className
      )}
    >
      {/* 1. SOURCES SECTION (if relevant) */}
      {hasSources && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sources Used
            </h3>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {sources.length}
            </span>
          </div>

          <div className="space-y-2">
            {visibleSources.map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => {
                  if (onOpenSource) {
                    onOpenSource(src);
                  } else {
                    addToast({
                      type: 'info',
                      title: `Viewing ${src.connectorName}`,
                      description: `Opened source: ${src.title}`,
                    });
                  }
                }}
                className="w-full p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 text-left flex items-center justify-between gap-2.5 transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {getSourceIcon(src.iconType || (src.connector as string))}
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-indigo-900">
                      {src.title}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 block truncate">
                      {src.connectorName}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}

            {/* Show all sources toggle */}
            {sources.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllSources(!showAllSources)}
                className="w-full pt-1 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>
                  {showAllSources
                    ? 'Show fewer sources'
                    : `Show all ${sources.length} sources`}
                </span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-150',
                    showAllSources && 'rotate-180'
                  )}
                />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. ACTIONS SECTION (if relevant) */}
      {hasActions && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Suggested Actions
          </h3>

          <div className="space-y-2">
            {actions.map((act) => (
              <button
                key={act.id}
                type="button"
                onClick={() => {
                  if (onExecuteAction) {
                    onExecuteAction(act);
                  } else {
                    addToast({
                      type: 'success',
                      title: 'Action Triggered',
                      description: `Executed: ${act.label}`,
                    });
                  }
                }}
                className="w-full p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 text-left flex items-center justify-between gap-2.5 transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {act.actionType === 'open_source' ? (
                    <div className="h-6 w-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  ) : act.actionType === 'share' ? (
                    <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Share2 className="h-3 w-3" />
                    </div>
                  ) : act.actionType === 'add_to_notion' ? (
                    <div className="h-6 w-6 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                      N
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <CheckSquare className="h-3 w-3" />
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-900">
                    {act.label}
                  </span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. MEMORY SECTION (if relevant) */}
      {hasMemory && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Context Memory
          </h3>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5">
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {memory.text}
            </p>

            <button
              type="button"
              onClick={() => {
                if (onNavigateToMemory) {
                  onNavigateToMemory();
                } else {
                  addToast({
                    type: 'info',
                    title: 'Memory Context',
                    description: 'Opening workspace memory overview.',
                  });
                }
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 text-xs font-semibold text-center border border-slate-200/80 transition-colors cursor-pointer"
            >
              {memory.actionText || 'View related memories'}
            </button>
          </div>
        </div>
      )}

      {/* 4. CLEAN EMPTY CONTEXT STATE (If nothing relevant is active) */}
      {!hasAnything && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2 text-center">
          <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Globe className="h-4 w-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Context Workspace</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Connected sources, actions, and memory insights will automatically appear here when Nexorbit accesses your connected world.
          </p>
        </div>
      )}

      {/* 5. PROACTIVE WATCH CARD */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#f0f4ff] via-[#f5f3ff] to-[#eef2ff] border border-indigo-100/90 p-4 sm:p-5 shadow-2xs overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 fill-indigo-200" />
            <span>Proactive Intelligence</span>
          </div>
          <h4 className="text-xs sm:text-[13px] font-bold text-slate-950 leading-snug">
            Working on something important?
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Let Nexorbit proactively track updates across your connected apps for you.
          </p>

          <button
            type="button"
            onClick={() => {
              if (onCreateWatch) {
                onCreateWatch();
              } else {
                addToast({
                  type: 'success',
                  title: 'Proactive Watch Created',
                  description: 'Nexorbit will alert you whenever your watched documents or discussions change.',
                });
              }
            }}
            className="mt-1 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            Create a Watch
          </button>
        </div>
      </div>
    </aside>
  );
};

