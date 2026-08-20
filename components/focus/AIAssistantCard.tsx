'use client';

import React from 'react';
import { Sparkles, Bot } from 'lucide-react';

export interface AIAssistantCardProps {
  onAskNexorbit?: () => void;
}

export const AIAssistantCard: React.FC<AIAssistantCardProps> = ({
  onAskNexorbit,
}) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-50/80 rounded-2xl border border-indigo-100/80 p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Bot className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
          AI Assistant
        </h3>
      </div>

      {/* Message */}
      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        I can adjust your plan, reschedule tasks, or add new priorities.
      </p>

      {/* Button */}
      <button
        onClick={onAskNexorbit}
        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
      >
        <Sparkles className="h-3.5 w-3.5 fill-white" />
        <span>Ask Nexorbit</span>
      </button>
    </div>
  );
};
