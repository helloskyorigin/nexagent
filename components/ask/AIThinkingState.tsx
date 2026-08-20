'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Brain } from 'lucide-react';
import { GlassSurface } from '../ui/Surfaces';
import { cn } from '../../lib/utils';

export interface AIThinkingStateProps {
  className?: string;
}

export const AIThinkingState: React.FC<AIThinkingStateProps> = ({ className }) => {
  const steps = [
    'Understanding your question...',
    'Finding relevant context across Gmail, Calendar & Drive...',
    'Connecting the dots...',
  ];

  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStepIdx(1), 500);
    const timer2 = setTimeout(() => setCurrentStepIdx(2), 1000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className={cn('my-4 max-w-xl animate-fadeIn', className)}>
      <GlassSurface className="p-4 sm:p-5 rounded-2xl border border-indigo-200/90 bg-white shadow-xs flex items-center gap-3.5">
        <div className="h-9 w-9 rounded-xl bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 relative">
          <Brain className="h-5 w-5 animate-pulse text-indigo-300" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white animate-ping" />
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">Nexorbit AI Reasoning</span>
            <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Processing
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium animate-pulse transition-all">
            {steps[currentStepIdx]}
          </p>
        </div>
      </GlassSurface>
    </div>
  );
};
