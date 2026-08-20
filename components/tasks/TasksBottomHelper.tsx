'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface TasksBottomHelperProps {
  onLearnMore?: () => void;
}

export const TasksBottomHelper: React.FC<TasksBottomHelperProps> = ({
  onLearnMore,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 pt-6 pb-4 text-xs text-slate-400">
      <div className="flex items-center gap-1.5 text-blue-400/90 font-medium">
        <Sparkles className="h-3.5 w-3.5" />
        <span className="text-slate-300">
          Create a new task or let Nexorbit agent do it for you.
        </span>
      </div>

      {onLearnMore && (
        <button
          type="button"
          onClick={onLearnMore}
          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer ml-1"
        >
          <span>Learn more</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};
