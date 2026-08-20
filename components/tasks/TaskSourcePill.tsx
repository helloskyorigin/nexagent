'use client';

import React from 'react';
import { Bot, MessageSquare, Calendar, User } from 'lucide-react';
import { TaskSource } from '../../services/tasks/taskService';

interface TaskSourcePillProps {
  source: TaskSource;
  className?: string;
}

export const TaskSourcePill: React.FC<TaskSourcePillProps> = ({
  source,
  className = '',
}) => {
  switch (source) {
    case 'agent':
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.06] ${className}`}
        >
          <Bot className="h-3 w-3 text-slate-400" />
          <span>Agent</span>
        </span>
      );

    case 'chat':
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.06] ${className}`}
        >
          <MessageSquare className="h-3 w-3 text-slate-400" />
          <span>Chat</span>
        </span>
      );

    case 'scheduled':
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.06] ${className}`}
        >
          <Calendar className="h-3 w-3 text-slate-400" />
          <span>Scheduled</span>
        </span>
      );

    case 'manual':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.06] ${className}`}
        >
          <User className="h-3 w-3 text-slate-400" />
          <span>Manual</span>
        </span>
      );
  }
};
