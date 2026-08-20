'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  Play,
  Pause,
  AlertTriangle,
  Send,
  Paperclip,
  Shield,
  Globe,
  Trash2,
  MoreVertical,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  AgentTask,
  updateAgentTaskStatus,
  respondToApproval,
  addInstructionToTask,
  deleteAgentTask,
} from '../../services/agent/storage';
import { StatusBadge } from './StatusBadge';
import { cn } from '../../lib/utils';

export interface AgentExecutionViewProps {
  task: AgentTask;
  onBack: () => void;
  onOpenNewTask: () => void;
}

export const AgentExecutionView: React.FC<AgentExecutionViewProps> = ({
  task,
  onBack,
  onOpenNewTask,
}) => {
  const [instructionInput, setInstructionInput] = useState('');

  const handleSendInstruction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructionInput.trim()) return;
    addInstructionToTask(task.id, instructionInput.trim());
    setInstructionInput('');
  };

  const handleSetStatus = (newStatus: 'running' | 'paused' | 'completed' | 'failed', progressVal?: number) => {
    updateAgentTaskStatus(task.id, newStatus, progressVal);
  };

  const pendingApprovals = task.approvals.filter((a) => a.status === 'pending');

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-[#15181D] border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Back to Agent Control Center"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {task.title}
              </h1>
              <StatusBadge status={task.status} />
            </div>
            <p className="text-xs text-slate-400">
              Task Execution & Monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pause / Resume Button */}
          <button
            type="button"
            onClick={() => handleSetStatus(task.status === 'running' ? 'paused' : 'running')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            {task.status === 'running' ? (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                <span>Resume</span>
              </>
            )}
          </button>

          {/* More Menu */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Delete this task?')) {
                deleteAgentTask(task.id);
                onBack();
              }
            }}
            className="p-2 rounded-xl bg-[#15181D] border border-slate-800 hover:border-red-500/50 hover:text-red-400 text-slate-400 transition-all cursor-pointer"
            title="Task Actions"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Mission & Execution Plan) */}
        <div className="lg:col-span-2 space-y-6">
          {/* MISSION CARD */}
          <div className="relative bg-[#15181D] border border-slate-800 rounded-2xl p-6 overflow-hidden shadow-xl">
            {/* Background Glow */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  MISSION
                </span>
                <StatusBadge status={task.status} />
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {task.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {task.description}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>Created {task.createdAt}</span>
                </div>
                <span>•</span>
                <div>Created by {task.createdBy}</div>
              </div>
            </div>
          </div>

          {/* Pending Approval Banner */}
          {pendingApprovals.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300">
                    Action Requires Approval
                  </h4>
                  <p className="text-xs text-amber-200/80 mt-0.5">
                    {pendingApprovals[0].action}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {pendingApprovals[0].details}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 justify-end">
                <button
                  type="button"
                  onClick={() => respondToApproval(task.id, pendingApprovals[0].id, 'rejected')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => respondToApproval(task.id, pendingApprovals[0].id, 'approved')}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors cursor-pointer"
                >
                  Approve &amp; Continue
                </button>
              </div>
            </div>
          )}

          {/* EXECUTION PLAN */}
          <div className="bg-[#15181D] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Execution Plan
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Steps generated from task input locally.
              </p>
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {task.executionPlan.map((step) => {
                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in_progress';
                const isWaiting = step.status === 'waiting_approval';

                return (
                  <div
                    key={step.id}
                    className={cn(
                      'flex items-start gap-3.5 p-3.5 rounded-xl border transition-all',
                      isInProgress
                        ? 'bg-[#181C26] border-blue-500/40 shadow-xs'
                        : isCompleted
                        ? 'bg-[#0D0F12]/60 border-slate-800/80'
                        : isWaiting
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-[#0D0F12] border-slate-800/50 opacity-70'
                    )}
                  >
                    <div
                      className={cn(
                        'h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5',
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isInProgress
                          ? 'bg-blue-600 text-white'
                          : isWaiting
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      )}
                    >
                      {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : step.stepNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className={cn(
                            'text-xs font-semibold',
                            isCompleted
                              ? 'text-slate-300'
                              : isInProgress
                              ? 'text-white'
                              : 'text-slate-400'
                          )}
                        >
                          {step.title}
                        </div>

                        <div className="shrink-0">
                          {isCompleted && (
                            <span className="text-[10px] font-medium text-emerald-400">
                              Completed
                            </span>
                          )}
                          {isInProgress && (
                            <span className="text-[10px] font-semibold text-blue-400 flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                              In progress
                            </span>
                          )}
                          {isWaiting && (
                            <span className="text-[10px] font-semibold text-amber-400">
                              Needs approval
                            </span>
                          )}
                          {step.status === 'pending' && (
                            <span className="text-[10px] font-medium text-slate-500">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D0F12] border border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400 shrink-0" />
                <span>Nexorbit will ask for approval before external actions.</span>
              </div>
            </div>
          </div>

          {/* Task Instructions Input */}
          <form onSubmit={handleSendInstruction} className="relative">
            <div className="flex items-center bg-[#15181D] border border-slate-800 focus-within:border-blue-500/60 rounded-2xl p-2 transition-all shadow-lg">
              <button
                type="button"
                className="p-2 text-slate-500 hover:text-slate-300 rounded-xl transition-colors cursor-pointer"
                title="Attach context file"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <input
                type="text"
                value={instructionInput}
                onChange={(e) => setInstructionInput(e.target.value)}
                placeholder="Give additional instructions to your agent..."
                className="flex-1 bg-transparent px-2 text-xs text-white outline-none placeholder:text-slate-500"
              />

              <button
                type="submit"
                disabled={!instructionInput.trim()}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (Live Status & Controls) */}
        <div className="space-y-6">
          {/* LIVE STATUS */}
          <div className="bg-[#15181D] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Live Status
              </h3>
              <StatusBadge status={task.status} />
            </div>

            {/* Circular Progress Ring */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative h-28 w-28 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500 transition-all duration-500"
                    strokeDasharray={`${task.progress}, 100`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-white">{task.progress}%</span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-400 mt-2">
                Progress
              </span>
            </div>

            {/* Controlled Local Preview Interactions */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Local UI Preview Controls
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSetStatus('running', 50)}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold border border-blue-500/30 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Play className="h-3 w-3" />
                  <span>Start preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetStatus('paused')}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Pause className="h-3 w-3" />
                  <span>Pause</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetStatus('running', 75)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Resume</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetStatus('completed', 100)}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Complete</span>
                </button>
              </div>
            </div>
          </div>

          {/* TOOLS IN USE */}
          <div className="bg-[#15181D] border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Tools in Use
            </h3>

            <div className="space-y-2">
              {task.toolsUsed.map((tool, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D0F12] border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-200">
                    <Globe className="h-3.5 w-3.5 text-blue-400" />
                    <span className="font-semibold">{tool.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    Preview
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY LOG */}
          <div className="bg-[#15181D] border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Recent Activity
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
              {task.activityLog.map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  <div className="min-w-0 flex-1">
                    <div className="text-slate-200 text-xs leading-normal">{act.event}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{act.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
