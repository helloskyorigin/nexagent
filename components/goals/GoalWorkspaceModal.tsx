'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  HardDrive,
  Mail,
  BookOpen,
  GitBranch,
  ShieldCheck,
  Plus,
  Play,
  Pause,
  ExternalLink,
} from 'lucide-react';
import { GoalItem, MilestoneItem, ConnectedSource } from './types';
import { GoalSourceIcon } from './GoalSourceIcon';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface GoalWorkspaceModalProps {
  goal: GoalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateGoal: (updatedGoal: GoalItem) => void;
  onOpenConnectorSource?: (source: ConnectedSource) => void;
}

export const GoalWorkspaceModal: React.FC<GoalWorkspaceModalProps> = ({
  goal,
  isOpen,
  onClose,
  onUpdateGoal,
  onOpenConnectorSource,
}) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'synaptic' | 'ai_strategy'>('overview');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  if (!isOpen || !goal) return null;

  const handleToggleMilestone = (milestoneId: string) => {
    const updatedMilestones = goal.milestones.map((m) => {
      if (m.id === milestoneId) {
        const nextCompleted = !m.isCompleted;
        return {
          ...m,
          isCompleted: nextCompleted,
          status: nextCompleted ? ('completed' as const) : ('in_progress' as const),
        };
      }
      return m;
    });

    // Re-calculate progress based on completed milestones
    const completedCount = updatedMilestones.filter((m) => m.isCompleted).length;
    const calculatedProgress = updatedMilestones.length > 0
      ? Math.round((completedCount / updatedMilestones.length) * 100)
      : goal.progress;

    const updated: GoalItem = {
      ...goal,
      milestones: updatedMilestones,
      progress: calculatedProgress,
      status: calculatedProgress === 100 ? 'completed' : goal.status,
    };

    onUpdateGoal(updated);
    addToast({
      title: 'Milestone Updated',
      description: 'Goal progress synchronized across Nexorbit.',
      type: 'success',
    });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    const newMilestone: MilestoneItem = {
      id: `m-${Date.now()}`,
      title: newMilestoneTitle.trim(),
      targetDate: newMilestoneDate || 'Next month',
      daysRemaining: 30,
      isCompleted: false,
      status: 'upcoming',
      goalTitle: goal.title,
    };

    const updated: GoalItem = {
      ...goal,
      milestones: [...goal.milestones, newMilestone],
    };

    onUpdateGoal(updated);
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
    addToast({
      title: 'Milestone Created',
      description: `Added "${newMilestone.title}" to ${goal.title}.`,
      type: 'success',
    });
  };

  const handleProgressChange = (newVal: number) => {
    const updated: GoalItem = {
      ...goal,
      progress: newVal,
      status: newVal === 100 ? 'completed' : newVal === 0 ? 'not_started' : goal.status,
    };
    onUpdateGoal(updated);
  };

  const handleExecuteNextAction = () => {
    addToast({
      title: 'Action Executed',
      description: `Launched workspace for: ${goal.nextAction.title}`,
      type: 'info',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden text-left z-10">
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-2xs">
              <Sparkles className="h-5 w-5 fill-indigo-500/10 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                  Goal Workspace
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">{goal.category}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {goal.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-100 flex items-center gap-6 text-xs sm:text-sm font-medium bg-white">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              'py-3 border-b-2 transition-colors cursor-pointer',
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            )}
          >
            Overview &amp; Next Action
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={cn(
              'py-3 border-b-2 transition-colors cursor-pointer',
              activeTab === 'milestones'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            )}
          >
            Milestones ({goal.milestones.length})
          </button>
          <button
            onClick={() => setActiveTab('synaptic')}
            className={cn(
              'py-3 border-b-2 transition-colors cursor-pointer',
              activeTab === 'synaptic'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            )}
          >
            Connected Apps &amp; Context
          </button>
          <button
            onClick={() => setActiveTab('ai_strategy')}
            className={cn(
              'py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5',
              activeTab === 'ai_strategy'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            )}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>AI Strategy</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description & Target Date */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {goal.description}
                </p>
                {goal.successMetric && (
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-200/60">
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    <span><strong className="text-slate-700">Success Metric:</strong> {goal.successMetric}</span>
                  </div>
                )}
              </div>

              {/* Progress Slider */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Progress Tracker</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">{goal.progress}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Drag slider to manually update progress:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                    className="w-32 cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              {/* Next Action Highlight */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                    <span>Next Best Action</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium text-slate-500">{goal.nextAction.time}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {goal.nextAction.title}
                  </h4>
                  {goal.nextAction.context && (
                    <p className="text-xs text-slate-600">{goal.nextAction.context}</p>
                  )}
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExecuteNextAction}
                  rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 px-4 rounded-xl shrink-0 cursor-pointer shadow-2xs"
                >
                  Start Action
                </Button>
              </div>

              {/* AI Synaptic Context Pill summary */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-600">Connected Context</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {goal.connectedSources.map((source) => (
                    <div
                      key={source.id}
                      onClick={() => onOpenConnectorSource?.(source)}
                      className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-200 flex items-start gap-2.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                    >
                      <GoalSourceIcon type={source.type} name={source.name} />
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-xs font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {source.detail}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {source.snippet || source.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="space-y-6">
              {/* Milestones List */}
              <div className="space-y-2.5">
                {goal.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(m.id)}
                    className={cn(
                      'p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer',
                      m.isCompleted
                        ? 'bg-slate-50/80 border-slate-200/60 opacity-80'
                        : 'bg-white border-slate-200/80 hover:border-indigo-200 shadow-2xs'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMilestone(m.id);
                        }}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {m.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-300" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <span
                          className={cn(
                            'text-xs sm:text-sm font-semibold block',
                            m.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                          )}
                        >
                          {m.title}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Due: {m.targetDate}
                        </span>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'text-[11px] font-medium px-2 py-0.5 rounded-md shrink-0',
                        m.isCompleted
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {m.isCompleted ? 'Completed' : `In ${m.daysRemaining} days`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Milestone Form */}
              <form
                onSubmit={handleAddMilestone}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
              >
                <span className="text-xs font-semibold text-slate-700 block">Add New Milestone</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    placeholder="Milestone title..."
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Target date (e.g. Jul 15)"
                    value={newMilestoneDate}
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Plus className="h-3.5 w-3.5" />}
                  className="text-xs h-8 px-3 rounded-lg cursor-pointer"
                >
                  Save Milestone
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'synaptic' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-indigo-700">
                  <Sparkles className="h-4 w-4" />
                  <span>Synaptic Intelligence Linkage</span>
                </div>
                <p className="text-indigo-800/80 leading-relaxed">
                  Nexorbit continuously synchronizes your active Gmail threads, Google Calendar meetings, Drive documents, and Notion project pages to infer context and automate progress tracking.
                </p>
              </div>

              {/* Source Details */}
              <div className="space-y-3">
                {goal.connectedSources.map((source) => (
                  <div
                    key={source.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GoalSourceIcon type={source.type} name={source.name} />
                        <span className="text-xs font-bold text-slate-900">{source.name}</span>
                        {source.time && (
                          <span className="text-[10.5px] text-slate-400 font-mono">• {source.time}</span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Synced
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-800">{source.detail}</div>
                    {source.snippet && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[11.5px]">
                        {source.snippet}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai_strategy' && (
            <div className="space-y-6">
              {/* Reasoning Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 border border-indigo-100 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Predictive Diagnosis</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {goal.aiReasoning}
                </p>
              </div>

              {/* Blockers */}
              {goal.blockers && goal.blockers.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Identified Risk Factors</span>
                  </div>
                  <ul className="space-y-1.5 list-disc list-inside text-xs text-amber-900">
                    {goal.blockers.map((b, i) => (
                      <li key={i} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Recommendation */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
                <span className="text-xs font-semibold text-slate-700">Recommended Optimization</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Protect 90 minutes of uninterrupted morning focus on Tuesday to finalize the pricing matrix before the client SLA meeting.
                </p>
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      addToast({
                        title: 'Focus Window Protected',
                        description: 'Added 90m deep work block to Google Calendar.',
                        type: 'success',
                      });
                    }}
                    className="text-xs h-8 px-3 rounded-lg cursor-pointer"
                  >
                    Schedule Focus Time
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Target: <strong className="text-slate-700">{goal.targetDate}</strong> • {goal.priority}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-xs h-9 px-4 rounded-xl cursor-pointer"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
