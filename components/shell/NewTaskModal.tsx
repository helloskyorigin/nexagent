'use client';

import React from 'react';
import { MessageSquare, Bot, CheckSquare, X } from 'lucide-react';

export interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'task' | 'chat' | 'agent') => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn select-none">
      <div
        className="w-full max-w-md bg-[#121520] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden p-6 relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title & Subtitle */}
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Create New Item
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose what type of workspace session or task you want to start.
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid grid-cols-1 gap-2.5">
          {/* Option 1: Tracked Task */}
          <button
            type="button"
            onClick={() => {
              onSelectType('task');
              onClose();
            }}
            className="w-full flex items-start gap-3.5 p-3.5 rounded-xl bg-[#161a27] hover:bg-[#1b2030] border border-white/[0.08] hover:border-blue-500/50 text-left transition-all duration-150 group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/[0.08] text-zinc-300 group-hover:text-blue-400 group-hover:border-blue-500/30 flex items-center justify-center shrink-0 transition-colors">
              <CheckSquare className="h-5 w-5 stroke-[1.8]" />
            </div>
            <div>
              <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                New Task
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 leading-normal font-normal">
                Create a tracked task, scheduled job, or action item in your Tasks workspace.
              </p>
            </div>
          </button>

          {/* Option 2: Agent Mission */}
          <button
            type="button"
            onClick={() => {
              onSelectType('agent');
              onClose();
            }}
            className="w-full flex items-start gap-3.5 p-3.5 rounded-xl bg-[#161a27] hover:bg-[#1b2030] border border-white/[0.08] hover:border-blue-500/50 text-left transition-all duration-150 group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/[0.08] text-zinc-300 group-hover:text-blue-400 group-hover:border-blue-500/30 flex items-center justify-center shrink-0 transition-colors">
              <Bot className="h-5 w-5 stroke-[1.8]" />
            </div>
            <div>
              <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                New Agent Mission
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 leading-normal font-normal">
                Autonomous task execution with multi-step missions, research tools, and planning.
              </p>
            </div>
          </button>

          {/* Option 3: Chat Conversation */}
          <button
            type="button"
            onClick={() => {
              onSelectType('chat');
              onClose();
            }}
            className="w-full flex items-start gap-3.5 p-3.5 rounded-xl bg-[#161a27] hover:bg-[#1b2030] border border-white/[0.08] hover:border-blue-500/50 text-left transition-all duration-150 group cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/[0.08] text-zinc-300 group-hover:text-blue-400 group-hover:border-blue-500/30 flex items-center justify-center shrink-0 transition-colors">
              <MessageSquare className="h-5 w-5 stroke-[1.8]" />
            </div>
            <div>
              <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                New Chat
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 leading-normal font-normal">
                Direct conversational AI for Q&A, brainstorming, code assistance, and analysis.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
