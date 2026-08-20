'use client';

import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { TaskStatus } from '../../services/tasks/taskService';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
  variant?: 'subtle' | 'solid';
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  switch (status) {
    case 'in_progress':
    case 'running':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 ${className}`}
        >
          <span>In Progress</span>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        </span>
      );

    case 'active':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}
        >
          <span>Active</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
      );

    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.05] text-slate-300 border border-white/[0.08] ${className}`}
        >
          <span>Completed</span>
          <Check className="h-3 w-3 text-slate-400 stroke-[2.5]" />
        </span>
      );

    case 'scheduled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 ${className}`}
        >
          <span>Scheduled</span>
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
        </span>
      );

    case 'waiting_approval':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 ${className}`}
        >
          <span>Awaiting Approval</span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
        </span>
      );

    case 'failed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 ${className}`}
        >
          <span>Failed</span>
          <AlertCircle className="h-3 w-3 text-rose-400" />
        </span>
      );

    case 'paused':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20 ${className}`}
        >
          <span>Paused</span>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-slate-400 border border-white/[0.06] ${className}`}
        >
          <span>{status}</span>
        </span>
      );
  }
};
