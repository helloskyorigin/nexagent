'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Pause,
  Play,
  Copy,
  Trash2,
  Send,
  Layers,
  Activity,
  ShieldAlert,
  Edit2,
  Save,
} from 'lucide-react';
import {
  TaskItem,
  TaskStatus,
  formatTaskDate,
  updateTask,
  updateTaskStatus,
  deleteTask,
  duplicateTask,
} from '../../services/tasks/taskService';
import { TaskIcon } from './TaskIcon';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskSourcePill } from './TaskSourcePill';

interface TaskDetailModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAgent?: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onNavigateToAgent,
}) => {
  if (!isOpen || !task) return null;

  return (
    <TaskDetailModalContent
      key={task.id}
      task={task}
      onClose={onClose}
      onNavigateToAgent={onNavigateToAgent}
    />
  );
};

const TaskDetailModalContent: React.FC<{
  task: TaskItem;
  onClose: () => void;
  onNavigateToAgent?: (taskId: string) => void;
}> = ({ task, onClose }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(task.title);
  const [instructionText, setInstructionText] = useState('');

  const { displayDate, creator } = formatTaskDate(task.createdAt);

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      updateTask(task.id, { title: titleInput.trim() });
      setIsEditingTitle(false);
    }
  };

  const handleAddInstruction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructionText.trim()) return;

    const timestampIso = new Date().toISOString();
    const newActivity = {
      id: `act-${timestampIso}`,
      event: `Instruction added: "${instructionText.trim()}"`,
      timestamp: timestampIso,
      type: 'info' as const,
    };

    updateTask(task.id, {
      activityLog: [newActivity, ...(task.activityLog || [])],
    });
    setInstructionText('');
  };

  const handleProgressChange = (newVal: number) => {
    updateTask(task.id, { progress: newVal });
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTaskStatus(task.id, newStatus);
  };

  const handleApprove = (approvalId: string) => {
    const timestampIso = new Date().toISOString();
    const updatedApprovals = (task.approvals || []).map((a) =>
      a.id === approvalId ? { ...a, status: 'approved' as const } : a
    );
    updateTask(task.id, {
      approvals: updatedApprovals,
      status: 'in_progress',
      activityLog: [
        {
          id: `act-appr-${timestampIso}`,
          event: 'Workspace authorization approved by user',
          timestamp: timestampIso,
          type: 'success',
        },
        ...(task.activityLog || []),
      ],
    });
  };

  const handleReject = (approvalId: string) => {
    const timestampIso = new Date().toISOString();
    const updatedApprovals = (task.approvals || []).map((a) =>
      a.id === approvalId ? { ...a, status: 'rejected' as const } : a
    );
    updateTask(task.id, {
      approvals: updatedApprovals,
      status: 'paused',
      activityLog: [
        {
          id: `act-rej-${timestampIso}`,
          event: 'Authorization request rejected by user',
          timestamp: timestampIso,
          type: 'warning',
        },
        ...(task.activityLog || []),
      ],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn select-none">
      <div
        className="relative w-full max-w-2xl bg-[#121520] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.06] flex items-start justify-between gap-4 bg-[#141824]">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <TaskIcon iconType={task.iconType} source={task.source} title={task.title} size="lg" />

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      className="bg-[#0D0F12] border border-blue-500/50 rounded-lg px-2.5 py-1 text-sm text-white focus:outline-none w-full"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveTitle}
                      className="p-1 rounded bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                      {task.title}
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setTitleInput(task.title);
                        setIsEditingTitle(true);
                      }}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-400 flex-wrap">
                <TaskSourcePill source={task.source} />
                <span>•</span>
                <span>Created {displayDate}</span>
                <span>•</span>
                <span className="text-slate-400">{creator}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 pr-2">
          {/* Status & Quick Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#161a27] border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Current Status:</span>
              <TaskStatusBadge status={task.status} />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {task.status !== 'completed' ? (
                <button
                  type="button"
                  onClick={() => handleStatusChange('completed')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Mark Complete</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStatusChange('active')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Re-activate</span>
                </button>
              )}

              {task.status === 'in_progress' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('paused')}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 border border-white/[0.08] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Pause className="h-3.5 w-3.5 text-amber-400" />
                  <span>Pause</span>
                </button>
              )}

              {task.status === 'paused' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange('in_progress')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Resume</span>
                </button>
              )}
            </div>
          </div>

          {/* Description Section */}
          {task.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Description & Goal
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 bg-[#161a27] border border-white/[0.04] p-3.5 rounded-xl leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          {/* Measurable Progress Slider (if applicable) */}
          {typeof task.progress === 'number' && (
            <div className="space-y-2 p-4 rounded-xl bg-[#161a27] border border-white/[0.06]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Execution Progress</span>
                <span className="font-mono font-bold text-blue-400">{task.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={task.progress}
                onChange={(e) => handleProgressChange(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          )}

          {/* Pending Approvals (if any) */}
          {task.approvals && task.approvals.filter((a) => a.status === 'pending').length > 0 && (
            <div className="space-y-2.5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="h-4 w-4" />
                <span>Action Requires Your Authorization</span>
              </div>
              {task.approvals
                .filter((a) => a.status === 'pending')
                .map((approval) => (
                  <div
                    key={approval.id}
                    className="p-3 rounded-lg bg-[#0D0F12]/80 border border-amber-500/20 space-y-2 text-xs"
                  >
                    <div className="font-semibold text-white">{approval.action}</div>
                    <div className="text-slate-300 text-[11px]">{approval.details}</div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApprove(approval.id)}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        Authorize & Proceed
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(approval.id)}
                        className="px-3 py-1 rounded bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Execution Plan (if Agent task) */}
          {task.executionPlan && task.executionPlan.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Layers className="h-3.5 w-3.5 text-blue-400" />
                <span>Autonomous Execution Plan</span>
              </div>

              <div className="space-y-2">
                {task.executionPlan.map((step) => (
                  <div
                    key={step.id}
                    className="p-3 rounded-xl bg-[#161a27] border border-white/[0.06] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-5 w-5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-[10px]">
                        {step.stepNumber}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-200">{step.title}</div>
                        <div className="text-[11px] text-slate-400">{step.description}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        step.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : step.status === 'in_progress'
                          ? 'bg-blue-500/15 text-blue-400'
                          : 'bg-white/[0.04] text-slate-400'
                      }`}
                    >
                      {step.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Activity className="h-3.5 w-3.5 text-blue-400" />
              <span>Activity History</span>
            </div>

            <div className="p-3 rounded-xl bg-[#161a27] border border-white/[0.06] space-y-2 max-h-40 overflow-y-auto">
              {task.activityLog && task.activityLog.length > 0 ? (
                task.activityLog.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start justify-between gap-2 text-xs py-1 border-b border-white/[0.03] last:border-0"
                  >
                    <span className="text-slate-300">{act.event}</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {formatTaskDate(act.timestamp).displayDate}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 text-center py-2">No activity records yet.</div>
              )}
            </div>
          </div>

          {/* Add Instruction Box */}
          <form onSubmit={handleAddInstruction} className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Add Note or Instruction
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={instructionText}
                onChange={(e) => setInstructionText(e.target.value)}
                placeholder="Type an update or instruction for this task..."
                className="flex-1 bg-[#161a27] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!instructionText.trim()}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/[0.06] bg-[#141824] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              duplicateTask(task.id);
              onClose();
            }}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Duplicate</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                deleteTask(task.id);
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
