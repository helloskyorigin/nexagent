'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, RotateCw, Flag, Check, Plus, AlertCircle } from 'lucide-react';
import { DailyPlanItem } from './types';
import { PlanSummaryCard } from './AIBrief';
import { TaskRow } from './TaskRow';
import { TaskActionModal } from './TaskActionModal';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthContext';
import {
  subscribeToTasks,
  updateTask,
  createTask,
  Task,
} from '../../services/firestore/tasks';

export interface CleanMyDayViewProps {
  onNavigate?: (pageId: string) => void;
  className?: string;
}

export const CleanMyDayView: React.FC<CleanMyDayViewProps> = ({
  onNavigate,
  className,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [selectedTaskItem, setSelectedTaskItem] = useState<DailyPlanItem | null>(null);

  // New task simple inline form state
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskPriority, setQuickTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Real-time listener for user tasks
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToTasks(
      user.uid,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setLoading(false);
      },
      (err) => {
        console.error('Error in subscribeToTasks:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Map Firestore Task to DailyPlanItem
  const planItems = useMemo<DailyPlanItem[]>(() => {
    return tasks.map((t) => ({
      id: t.id || '',
      title: t.title,
      isCompleted: t.status === 'completed',
      priority: t.priority || 'medium',
      timeSlot: t.connectorId ? 'App Sync' : 'Workspace Focus',
      connectorId: t.connectorId || 'personal',
      reason: t.description || 'Prioritized based on workspace activity metrics.',
      impact: t.priority === 'high' ? 'High critical impact' : 'General workspace action',
    }));
  }, [tasks]);

  // Grouped Priorities
  const highPriorityItems = planItems.filter((item) => item.priority === 'high');
  const mediumPriorityItems = planItems.filter((item) => item.priority === 'medium');
  const lowPriorityItems = planItems.filter((item) => item.priority === 'low');

  // Toggle complete via Firestore
  const handleToggleComplete = async (id: string) => {
    const item = planItems.find((p) => p.id === id);
    if (!item) return;

    const nextCompleted = !item.isCompleted;
    try {
      await updateTask(id, {
        status: nextCompleted ? 'completed' : 'pending',
      });
      addToast({
        title: nextCompleted ? 'Task completed' : 'Task reopened',
        description: `Updated: "${item.title}"`,
        type: 'success',
      });
    } catch (err) {
      console.error('Error updating task in Firestore:', err);
      addToast({
        title: 'Error',
        description: 'Failed to update task in Firestore.',
        type: 'error',
      });
    }
  };

  // Quick task creation
  const handleQuickAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !quickTaskTitle.trim()) return;

    try {
      await createTask(user.uid, {
        title: quickTaskTitle.trim(),
        description: 'Created quickly in Clean My Day.',
        status: 'pending',
        priority: quickTaskPriority,
      });

      setQuickTaskTitle('');
      setShowQuickAdd(false);
      addToast({
        title: 'Task Created',
        description: 'Your new task was added to Firestore in real-time.',
        type: 'success',
      });
    } catch (err) {
      console.error('Error creating task:', err);
      addToast({
        title: 'Error',
        description: 'Failed to create task.',
        type: 'error',
      });
    }
  };

  // Seed default daily focus tasks
  const handleSeedFocusPlan = async () => {
    if (!user?.uid) return;
    setIsRegenerating(true);

    try {
      // Create high-quality real Firestore tasks
      await createTask(user.uid, {
        title: 'Review Project Alpha timeline',
        description: 'Align milestones with updated Google Calendar schedules.',
        status: 'pending',
        priority: 'high',
      });

      await createTask(user.uid, {
        title: 'Respond to Rahul’s proposal email',
        description: 'Draft feedback on final commercial parameters.',
        status: 'pending',
        priority: 'medium',
      });

      await createTask(user.uid, {
        title: 'Clean Drive proposal documentation',
        description: 'Ensure correct client access permissions on sharing links.',
        status: 'pending',
        priority: 'low',
      });

      addToast({
        title: 'Focus Plan Initialized',
        description: 'Successfully seeded 3 smart workspace tasks to Firestore.',
        type: 'success',
      });
    } catch (err) {
      console.error('Error seeding tasks:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleAskNexorbit = (query?: string) => {
    if (onNavigate) {
      sessionStorage.setItem('pending_ask_command', query || 'Show today’s workspace priorities');
      onNavigate('chat');
    }
  };

  const hasItems = planItems.length > 0;

  return (
    <div
      className={cn(
        'min-h-screen bg-slate-50/50 pb-28 antialiased',
        className
      )}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* ========================================================================= */}
        {/* HEADER                                                                    */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Clean My Day</span>
              <Sparkles className="h-5 w-5 text-indigo-600 fill-indigo-600/10" />
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Organize and act on your real-time workspace focus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuickAdd((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>

            <button
              onClick={handleSeedFocusPlan}
              disabled={isRegenerating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700 transition-all shadow-2xs hover:border-slate-300 cursor-pointer disabled:opacity-60"
            >
              <RotateCw className={cn('h-3.5 w-3.5 text-indigo-600', isRegenerating && 'animate-spin')} />
              <span>{isRegenerating ? 'Calculating...' : 'Recalculate Priorities'}</span>
            </button>
          </div>
        </div>

        {/* Quick Add Form Row */}
        {showQuickAdd && (
          <form
            onSubmit={handleQuickAddTask}
            className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-xs flex flex-col sm:flex-row items-center gap-3 animate-slideIn"
          >
            <input
              type="text"
              required
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
              placeholder="What task needs focus?"
              className="flex-1 w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={quickTaskPriority}
                onChange={(e) => setQuickTaskPriority(e.target.value as any)}
                className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        )}

        {/* Plan Summary Context */}
        <PlanSummaryCard />

        {/* ========================================================================= */}
        {/* MAIN PLAN LIST                                                            */}
        {/* ========================================================================= */}
        {!hasItems ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-2xs space-y-4 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Your day is clear.</h3>
              <p className="text-xs text-slate-500">
                You have no pending tasks scheduled for today.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleSeedFocusPlan}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Initialize Focus Plan</span>
              </button>
              <button
                onClick={() => setShowQuickAdd(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* HIGH PRIORITY */}
            {highPriorityItems.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-1">
                  <Flag className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    High Priority
                  </span>
                  <div className="h-[1px] flex-1 bg-slate-200/70" />
                </div>

                <div className="space-y-2">
                  {highPriorityItems.map((item) => (
                    <TaskRow
                      key={item.id}
                      item={item}
                      onActionClick={(selected) => setSelectedTaskItem(selected)}
                      onCompleteToggle={handleToggleComplete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* MEDIUM PRIORITY */}
            {mediumPriorityItems.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-1">
                  <Flag className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Medium Priority
                  </span>
                  <div className="h-[1px] flex-1 bg-slate-200/70" />
                </div>

                <div className="space-y-2">
                  {mediumPriorityItems.map((item) => (
                    <TaskRow
                      key={item.id}
                      item={item}
                      onActionClick={(selected) => setSelectedTaskItem(selected)}
                      onCompleteToggle={handleToggleComplete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* LOW PRIORITY */}
            {lowPriorityItems.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-1">
                  <Flag className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Low Priority
                  </span>
                  <div className="h-[1px] flex-1 bg-slate-200/70" />
                </div>

                <div className="space-y-2">
                  {lowPriorityItems.map((item) => (
                    <TaskRow
                      key={item.id}
                      item={item}
                      onActionClick={(selected) => setSelectedTaskItem(selected)}
                      onCompleteToggle={handleToggleComplete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SUBTLE BOTTOM AI RECOMMENDATION                                           */}
            {/* ========================================================================= */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-indigo-100/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase">
                    AI Recommendation
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5 leading-relaxed">
                    Recalculate priorities to sync any new calendar, email, or Slack signals automatically.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleAskNexorbit('How should I resolve today’s critical tasks?')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-semibold border border-indigo-200/60 transition-colors cursor-pointer shrink-0 self-start sm:self-center"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Ask Nexorbit</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TASK DETAIL / ACTION MODAL                                                */}
      {/* ========================================================================= */}
      <TaskActionModal
        item={selectedTaskItem}
        isOpen={!!selectedTaskItem}
        onClose={() => setSelectedTaskItem(null)}
        onAskNexorbit={handleAskNexorbit}
      />
    </div>
  );
};
