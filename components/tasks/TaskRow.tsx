'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MoreHorizontal,
  FolderOpen,
  Edit2,
  Pause,
  Play,
  CheckCircle2,
  Copy,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  TaskItem,
  formatTaskDate,
} from '../../services/tasks/taskService';
import { TaskIcon } from './TaskIcon';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskSourcePill } from './TaskSourcePill';

interface TaskRowProps {
  task: TaskItem;
  onOpen: (task: TaskItem) => void;
  onRename: (task: TaskItem) => void;
  onUpdateStatus: (task: TaskItem, newStatus: TaskItem['status']) => void;
  onDuplicate: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onOpen,
  onRename,
  onUpdateStatus,
  onDuplicate,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const { displayDate, creator } = formatTaskDate(task.createdAt);

  const isCompleted = task.status === 'completed';
  const isRunning = task.status === 'in_progress' || task.status === 'running' || task.status === 'active';
  const isPaused = task.status === 'paused';
  const isScheduled = task.status === 'scheduled';
  const hasProgress = typeof task.progress === 'number' && task.progress >= 0;

  // Determine progress color
  const progressFillColor =
    task.progress !== undefined && task.progress < 50
      ? 'bg-amber-500'
      : 'bg-blue-500';

  return (
    <div
      id={`task-row-${task.id}`}
      className="group relative bg-[#121520]/90 hover:bg-[#151928] border border-white/[0.06] hover:border-white/[0.14] rounded-2xl p-4 sm:p-5 transition-all duration-150 shadow-2xs cursor-pointer"
      onClick={() => onOpen(task)}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Column: Task Info (Icon + Title + Description + Source) */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
          <TaskIcon
            iconType={task.iconType}
            source={task.source}
            title={task.title}
          />

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-[15px] font-semibold text-white tracking-tight group-hover:text-blue-300/95 transition-colors truncate max-w-lg">
                {task.title}
              </h3>
            </div>

            {task.description && (
              <p className="text-xs text-slate-400 font-normal line-clamp-1 leading-relaxed max-w-2xl">
                {task.description}
              </p>
            )}

            <div className="pt-0.5">
              <TaskSourcePill source={task.source} />
            </div>
          </div>
        </div>

        {/* Right Section: Status & Progress, Created Date, Actions */}
        <div
          className="flex items-center justify-between md:justify-end gap-5 sm:gap-8 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.04]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Status & Progress Column */}
          <div className="flex flex-col items-start md:items-end justify-center min-w-[130px] space-y-1.5">
            <TaskStatusBadge status={task.status} />

            {/* Measurable Progress Bar (only rendered if progress is provided) */}
            {hasProgress && !isCompleted && (
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="w-20 sm:w-24 h-1.5 bg-slate-800/90 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${progressFillColor} transition-all duration-300 rounded-full`}
                    style={{ width: `${Math.min(100, Math.max(0, task.progress!))}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-400 font-mono">
                  {task.progress}%
                </span>
              </div>
            )}
          </div>

          {/* Created Date Column */}
          <div className="flex flex-col items-start md:items-start min-w-[110px]">
            <span className="text-xs font-medium text-slate-300 tracking-tight">
              {displayDate}
            </span>
            <span className="text-[11px] text-slate-500">
              {creator}
            </span>
          </div>

          {/* Actions Menu Column */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="h-8 w-8 rounded-xl bg-transparent hover:bg-white/[0.06] text-slate-400 hover:text-white border border-transparent hover:border-white/[0.1] flex items-center justify-center transition-all cursor-pointer"
              title={`Actions for ${task.title}`}
              aria-label={`Actions for ${task.title}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {/* Context-Aware Action Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#161a27] border border-white/[0.1] rounded-xl shadow-2xl z-30 py-1.5 divide-y divide-white/[0.06] animate-fadeIn">
                {/* Primary options */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpen(task);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <FolderOpen className="h-3.5 w-3.5 text-blue-400" />
                    <span>Open workspace</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onRename(task);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Rename</span>
                  </button>

                  {isRunning && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onUpdateStatus(task, 'paused');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Pause className="h-3.5 w-3.5 text-amber-400" />
                      <span>Pause task</span>
                    </button>
                  )}

                  {isPaused && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onUpdateStatus(task, 'in_progress');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Play className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Resume task</span>
                    </button>
                  )}

                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onUpdateStatus(task, 'completed');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Mark completed</span>
                    </button>
                  )}

                  {isCompleted && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onUpdateStatus(task, 'active');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Play className="h-3.5 w-3.5 text-blue-400" />
                      <span>Re-activate task</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(task);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Duplicate</span>
                  </button>
                </div>

                {/* Destructive options */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(task);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete task</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
