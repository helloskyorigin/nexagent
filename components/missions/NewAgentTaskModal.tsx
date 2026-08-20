'use client';

import React, { useState } from 'react';
import {
  X,
  Bot,
  Mail,
  Calendar,
  HardDrive,
  GitBranch,
  Globe,
  FileText,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { createAgentTask } from '../../services/agent/storage';
import { cn } from '../../lib/utils';

export interface NewAgentTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (taskId: string) => void;
}

const AVAILABLE_CAPABILITIES = [
  { id: 'Gmail', name: 'Gmail', icon: Mail, connected: false },
  { id: 'Google Drive', name: 'Google Drive', icon: HardDrive, connected: false },
  { id: 'Calendar', name: 'Calendar', icon: Calendar, connected: false },
  { id: 'GitHub', name: 'GitHub', icon: GitBranch, connected: false },
  { id: 'Web', name: 'Web Search', icon: Globe, connected: true },
  { id: 'Files', name: 'Files & Workspace', icon: FileText, connected: true },
];

export const NewAgentTaskModal: React.FC<NewAgentTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
}) => {
  const [step, setStep] = useState<'create' | 'review'>('create');
  const [goal, setGoal] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>(['Web', 'Files']);
  const [reviewBeforeExecution, setReviewBeforeExecution] = useState(true);

  if (!isOpen) return null;

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  };

  const handleReset = () => {
    setGoal('');
    setInstructions('');
    setSelectedTools(['Web', 'Files']);
    setReviewBeforeExecution(true);
    setStep('create');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    setStep('review');
  };

  const handleCreateTask = () => {
    if (!goal.trim()) return;

    const newTask = createAgentTask({
      title: goal.trim(),
      description: instructions.trim() || 'Autonomous work execution by Nexorbit Agent.',
      selectedTools,
      requireApproval: reviewBeforeExecution,
    });

    handleClose();
    onTaskCreated(newTask.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn select-none"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xl bg-[#15181D] border border-slate-800 rounded-2xl shadow-2xl p-6 relative space-y-5 max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {step === 'create' ? 'What should Nexorbit get done?' : 'Review task'}
              </h2>
              <p className="text-xs text-slate-400">
                {step === 'create'
                  ? 'Describe the work you want Nexorbit to handle.'
                  : 'Confirm mission guidelines before execution starts.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === 'create' ? (
          /* STEP 1: CREATE TASK FORM */
          <form onSubmit={handleContinue} className="space-y-4">
            {/* Task Description / Goal Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work description <span className="text-blue-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Describe the work you want Nexorbit to handle…"
                autoFocus
                className="w-full p-3.5 rounded-xl bg-[#0D0F12] border border-slate-700/80 focus:border-blue-500 text-sm text-white outline-none placeholder:text-slate-500 transition-colors resize-none"
              />
            </div>

            {/* Tools Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Tools
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AVAILABLE_CAPABILITIES.map((cap) => {
                  const isSelected = selectedTools.includes(cap.id);
                  const Icon = cap.icon;
                  return (
                    <button
                      key={cap.id}
                      type="button"
                      onClick={() => toggleTool(cap.id)}
                      className={cn(
                        'flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer',
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500/50 text-white'
                          : 'bg-[#0D0F12] border-slate-800 text-slate-400 hover:border-slate-700'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className={cn('h-4 w-4 shrink-0', isSelected ? 'text-blue-400' : 'text-slate-500')} />
                        <span className="text-xs font-semibold truncate">{cap.name}</span>
                      </div>
                      {!cap.connected && (
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded uppercase shrink-0">
                          Preview
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Task Instructions */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Task instructions <span className="text-slate-500">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Additional instructions, format guidelines, or constraints..."
                className="w-full p-3 rounded-xl bg-[#0D0F12] border border-slate-700/80 focus:border-blue-500 text-xs text-white outline-none placeholder:text-slate-500 transition-colors resize-none"
              />
            </div>

            {/* Review Before Execution Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0D0F12] border border-slate-800">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white">Review before execution</div>
                  <div className="text-[11px] text-slate-400">
                    Ask for approval before taking important external actions.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={reviewBeforeExecution}
                onChange={(e) => setReviewBeforeExecution(e.target.checked)}
                className="h-4 w-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!goal.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        ) : (
          /* STEP 2: TASK REVIEW */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0D0F12] border border-slate-800 space-y-3">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Goal
                </div>
                <p className="text-sm font-semibold text-white mt-1 leading-normal">
                  {goal}
                </p>
              </div>

              {instructions.trim() && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Instructions
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-normal">
                    {instructions}
                  </p>
                </div>
              )}

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Tools
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedTools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Approval
                </div>
                <p className="text-xs font-semibold text-amber-400 mt-1">
                  {reviewBeforeExecution
                    ? 'Ask before important actions'
                    : 'Proceed automatically'}
                </p>
              </div>
            </div>

            {/* Review Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep('create')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleCreateTask}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Create task</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
