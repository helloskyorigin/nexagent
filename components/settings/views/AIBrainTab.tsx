'use client';

import React from 'react';
import { Sparkles, MessageSquare, Zap, Cpu } from 'lucide-react';
import { AIBrainPreferences } from '../types';
import { cn } from '../../../lib/utils';

export interface AIBrainTabProps {
  preferences: AIBrainPreferences;
  onChange: (updated: Partial<AIBrainPreferences>) => void;
  className?: string;
}

export const AIBrainTab: React.FC<AIBrainTabProps> = ({
  preferences,
  onChange,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-0.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          AI Preferences
        </h2>
        <p className="text-xs text-slate-500 font-normal">
          Control AI response style, default mode, and proactive suggestions.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-6 text-xs">
        {/* Default AI Mode */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Cpu className="h-4 w-4 text-blue-600" />
            <span>Default AI Mode</span>
          </div>
          <p className="text-slate-500 text-[11px] font-normal">
            Choose how Nexorbit synthesizes answers from your workspace and general knowledge.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {(['Auto', 'Nexorbit AI', 'My Connected World'] as const).map((mode) => {
              const selected = preferences.defaultMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChange({ defaultMode: mode })}
                  className={cn(
                    'p-3 rounded-2xl border text-left transition-all cursor-pointer select-none',
                    selected
                      ? 'bg-blue-50/90 border-blue-200 text-blue-600 font-bold shadow-2xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700 font-medium'
                  )}
                >
                  <div className="text-xs">{mode}</div>
                  <div className="text-[10px] opacity-75 mt-0.5 font-normal">
                    {mode === 'Auto'
                      ? 'Smart auto-routing'
                      : mode === 'Nexorbit AI'
                      ? 'General reasoning'
                      : 'Apps & email context'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5 space-y-2">
          {/* AI Response Style */}
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span>AI Response Style</span>
          </div>
          <p className="text-slate-500 text-[11px] font-normal">
            Adjust verbosity and level of detail in generated summaries and answers.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {(['Concise', 'Balanced', 'Detailed'] as const).map((style) => {
              const selected = preferences.responseStyle === style;
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => onChange({ responseStyle: style })}
                  className={cn(
                    'py-2 px-3 rounded-xl border text-center transition-all cursor-pointer font-semibold select-none',
                    selected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
                  )}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-slate-900 font-bold">Proactive Suggestions</div>
              <div className="text-[11px] text-slate-400 font-normal">
                Surface actionable insights in Clean My Day automatically
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange({ proactiveSuggestions: !preferences.proactiveSuggestions })}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                preferences.proactiveSuggestions ? 'bg-blue-600' : 'bg-slate-200'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                  preferences.proactiveSuggestions ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <div className="text-slate-900 font-bold">Auto-Extract Key Entities</div>
              <div className="text-[11px] text-slate-400 font-normal">
                Automatically detect people, dates, and projects in conversations
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange({ autoExtractEntities: !preferences.autoExtractEntities })}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
                preferences.autoExtractEntities ? 'bg-blue-600' : 'bg-slate-200'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                  preferences.autoExtractEntities ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
