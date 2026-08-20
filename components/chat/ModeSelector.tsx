'use client';

import React from 'react';
import { Sparkles, Bot, Globe } from 'lucide-react';
import { AIMode } from './types';
import { cn } from '../../lib/utils';

export interface ModeSelectorProps {
  currentMode: AIMode;
  onChangeMode: (mode: AIMode) => void;
  className?: string;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onChangeMode,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full max-w-xl mx-auto flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs select-none',
        className
      )}
      role="radiogroup"
      aria-label="AI Intelligence Mode"
    >
      {/* 1. Auto Mode */}
      <button
        type="button"
        role="radio"
        aria-checked={currentMode === 'auto'}
        onClick={() => onChangeMode('auto')}
        title="Auto: Nexorbit decides whether request needs general AI or connected context"
        className={cn(
          'flex-1 py-2 px-3 rounded-xl transition-all duration-150 text-center flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold',
          currentMode === 'auto'
            ? 'bg-white text-indigo-900 shadow-xs border border-slate-200/90'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        )}
      >
        <Sparkles
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-colors',
            currentMode === 'auto' ? 'text-indigo-600 fill-indigo-100' : 'text-slate-400'
          )}
        />
        <span>Auto</span>
      </button>

      {/* 2. Nexorbit AI (General) */}
      <button
        type="button"
        role="radio"
        aria-checked={currentMode === 'general'}
        onClick={() => onChangeMode('general')}
        title="Nexorbit AI: General AI conversation"
        className={cn(
          'flex-1 py-2 px-3 rounded-xl transition-all duration-150 text-center flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold',
          currentMode === 'general'
            ? 'bg-white text-indigo-900 shadow-xs border border-slate-200/90'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        )}
      >
        <Bot
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-colors',
            currentMode === 'general' ? 'text-indigo-600' : 'text-slate-400'
          )}
        />
        <span>Nexorbit AI</span>
      </button>

      {/* 3. My Connected World */}
      <button
        type="button"
        role="radio"
        aria-checked={currentMode === 'connected'}
        onClick={() => onChangeMode('connected')}
        title="My Connected World: Use information from user's connected apps"
        className={cn(
          'flex-1 py-2 px-3 rounded-xl transition-all duration-150 text-center flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold',
          currentMode === 'connected'
            ? 'bg-white text-indigo-900 shadow-xs border border-slate-200/90'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        )}
      >
        <Globe
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-colors',
            currentMode === 'connected' ? 'text-indigo-600' : 'text-slate-400'
          )}
        />
        <span className="truncate">My Connected World</span>
      </button>
    </div>
  );
};

