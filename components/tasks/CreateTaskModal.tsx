'use client';

import React, { useState } from 'react';
import {
  X,
  Bot,
  MessageSquare,
  Calendar,
  User,
  ShieldCheck,
  Check,
  Loader2,
  Plus,
} from 'lucide-react';
import {
  TaskSource,
  createTask,
  TaskItem,
  inferTaskIconType,
} from '../../services/tasks/taskService';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: TaskItem) => void;
  initialSource?: TaskSource;
}

const AVAILABLE_TOOLS = [
  'Web Search',
  'Google Drive',
  'Gmail',
  'Google Calendar',
  'GitHub',
  'Slack',
  'Notion',
];

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
  initialSource = 'manual',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState<TaskSource>(initialSource);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [selectedTools, setSelectedTools] = useState<string[]>(['Web Search']);
  const [trackProgress, setTrackProgress] = useState(false);
  const [initialProgress, setInitialProgress] = useState<number>(0);
  const [requireApproval, setRequireApproval] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleTool = (toolName: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolName)
        ? prev.filter((t) => t !== toolName)
        : [...prev, toolName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let scheduledForIso: string | undefined = undefined;
      if (source === 'scheduled' && scheduledDate) {
        scheduledForIso = new Date(`${scheduledDate}T${scheduledTime || '09:00'}:00`).toISOString();
      }

      const newTask = createTask({
        title: title.trim(),
        description: description.trim(),
        source,
        progress: trackProgress || source === 'agent' ? initialProgress || (source === 'agent' ? 25 : 0) : undefined,
        scheduledFor: scheduledForIso,
        connectedTools: source === 'agent' ? selectedTools : undefined,
        requireApproval: source === 'agent' ? requireApproval : undefined,
        iconType: inferTaskIconType(title, description),
      });

      onTaskCreated(newTask);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setSource('manual');
      setTrackProgress(false);
      setInitialProgress(0);
    } catch (err: any) {
      setError(err?.message || 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn select-none">
      <div
        className="relative w-full max-w-lg bg-[#121520] border border-white/[0.1] rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Create New Task
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add a task for yourself, chat session, or autonomous agent execution.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Mode / Source Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Execution Mode / Source
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'manual' as TaskSource, label: 'Manual', icon: User },
                { id: 'agent' as TaskSource, label: 'Agent', icon: Bot },
                { id: 'chat' as TaskSource, label: 'Chat', icon: MessageSquare },
                { id: 'scheduled' as TaskSource, label: 'Scheduled', icon: Calendar },
              ].map((item) => {
                const isSelected = source === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSource(item.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500/40 text-blue-400 shadow-2xs'
                        : 'bg-[#161a27] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/[0.12]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Task Title */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Prepare weekly research report"
              className="w-full bg-[#161a27] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Description / Instructions
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context or specific deliverables..."
              className="w-full bg-[#161a27] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 resize-none"
            />
          </div>

          {/* If Scheduled: Date & Time Picker */}
          {source === 'scheduled' && (
            <div className="p-3.5 rounded-xl bg-[#161a27] border border-white/[0.06] space-y-3">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                Schedule Target
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-[#121520] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-[#121520] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* If Agent: Connected Tools Selection */}
          {source === 'agent' && (
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Connected Tools & Plugins
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TOOLS.map((tool) => {
                  const isSelected = selectedTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                          : 'bg-[#161a27] text-slate-400 border border-white/[0.06] hover:border-white/[0.12]'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-blue-400" />}
                      <span>{tool}</span>
                    </button>
                  );
                })}
              </div>

              {/* Approval Option */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={requireApproval}
                    onChange={(e) => setRequireApproval(e.target.checked)}
                    className="rounded border-white/20 bg-black/40 text-blue-600 focus:ring-0 h-3.5 w-3.5"
                  />
                  <span>Require approval before performing external workspace actions</span>
                </label>
              </div>
            </div>
          )}

          {/* Progress Tracking Option (for manual tasks) */}
          {source !== 'agent' && (
            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={trackProgress}
                  onChange={(e) => setTrackProgress(e.target.checked)}
                  className="rounded border-white/20 bg-black/40 text-blue-600 focus:ring-0 h-3.5 w-3.5"
                />
                <span>Track measurable progress percentage</span>
              </label>

              {trackProgress && (
                <div className="mt-2.5 pl-5.5 flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={initialProgress}
                    onChange={(e) => setInitialProgress(Number(e.target.value))}
                    className="flex-1 accent-blue-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-semibold text-blue-400 w-10 text-right">
                    {initialProgress}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
