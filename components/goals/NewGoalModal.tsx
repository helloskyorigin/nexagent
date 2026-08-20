'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Target,
  Calendar,
  Layers,
  ShieldCheck,
  Plus,
  Zap,
  ArrowRight,
  Bot,
  Loader2,
  Check,
} from 'lucide-react';
import { GoalItem, GoalPriority, ConnectedSource, MilestoneItem } from './types';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (newGoal: GoalItem) => void;
  initialMode?: 'manual' | 'ai';
}

export const NewGoalModal: React.FC<NewGoalModalProps> = ({
  isOpen,
  onClose,
  onCreateGoal,
  initialMode = 'manual',
}) => {
  const { addToast } = useToast();
  const [mode, setMode] = useState<'manual' | 'ai'>(initialMode);

  // Manual Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Work' | 'Personal' | 'Learning' | 'Health'>('Work');
  const [targetDate, setTargetDate] = useState('Jun 30, 2025');
  const [priority, setPriority] = useState<GoalPriority>('High priority');
  const [successMetric, setSuccessMetric] = useState('');
  const [nextActionTitle, setNextActionTitle] = useState('');
  const [nextActionTime, setNextActionTime] = useState('Tomorrow');

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    title: string;
    description: string;
    category: 'Work' | 'Personal' | 'Learning' | 'Health';
    targetDate: string;
    priority: GoalPriority;
    successMetric: string;
    nextAction: { title: string; time: string };
    milestones: { title: string; targetDate: string }[];
  } | null>(null);

  if (!isOpen) return null;

  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);

      // Intelligent suggestion generator
      const lower = aiPrompt.toLowerCase();
      let generatedCategory: 'Work' | 'Personal' | 'Learning' | 'Health' = 'Work';
      let generatedPriority: GoalPriority = 'High priority';
      let suggestedDate = 'Jun 30, 2025';

      if (lower.includes('fitness') || lower.includes('health') || lower.includes('marathon') || lower.includes('gym')) {
        generatedCategory = 'Health';
        generatedPriority = 'Medium priority';
        suggestedDate = 'Jul 31, 2025';
      } else if (lower.includes('book') || lower.includes('read') || lower.includes('habit') || lower.includes('guitar')) {
        generatedCategory = 'Personal';
        generatedPriority = 'Low priority';
        suggestedDate = 'Dec 31, 2025';
      } else if (lower.includes('learn') || lower.includes('course') || lower.includes('ai') || lower.includes('rust') || lower.includes('python')) {
        generatedCategory = 'Learning';
        generatedPriority = 'Medium priority';
        suggestedDate = 'Aug 31, 2025';
      }

      setAiSuggestion({
        title: aiPrompt.trim().slice(0, 50),
        description: `Execute strategic objectives for: "${aiPrompt.trim()}". Parsed and aligned with active workspace context.`,
        category: generatedCategory,
        targetDate: suggestedDate,
        priority: generatedPriority,
        successMetric: 'Complete all 3 core roadmap milestones and review with stakeholders',
        nextAction: {
          title: `Draft foundational outline for ${aiPrompt.trim().slice(0, 25)}`,
          time: 'Tomorrow, 10:00 AM',
        },
        milestones: [
          { title: 'Define scope, requirements and success criteria', targetDate: 'Next week' },
          { title: 'Execute core build phase and prototype', targetDate: 'In 30 days' },
          { title: 'Final review and launch', targetDate: suggestedDate },
        ],
      });
    }, 900);
  };

  const handleApplyAiSuggestion = () => {
    if (!aiSuggestion) return;
    setTitle(aiSuggestion.title);
    setDescription(aiSuggestion.description);
    setCategory(aiSuggestion.category);
    setTargetDate(aiSuggestion.targetDate);
    setPriority(aiSuggestion.priority);
    setSuccessMetric(aiSuggestion.successMetric);
    setNextActionTitle(aiSuggestion.nextAction.title);
    setNextActionTime(aiSuggestion.nextAction.time);
    setMode('manual');
    addToast({
      title: 'AI Blueprint Applied',
      description: 'Review and customize the generated goal fields.',
      type: 'info',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let iconType: GoalItem['iconType'] = 'target';
    let iconTheme: GoalItem['iconTheme'] = 'purple';

    if (category === 'Health') {
      iconType = 'heart';
      iconTheme = 'rose';
    } else if (category === 'Learning') {
      iconType = 'brain';
      iconTheme = 'amber';
    } else if (category === 'Personal') {
      iconType = 'book';
      iconTheme = 'blue';
    } else if (category === 'Work') {
      iconType = 'rocket';
      iconTheme = 'purple';
    }

    const defaultMilestones: MilestoneItem[] = aiSuggestion?.milestones
      ? aiSuggestion.milestones.map((m, idx) => ({
          id: `m-new-${Date.now()}-${idx}`,
          title: m.title,
          targetDate: m.targetDate,
          daysRemaining: 30 * (idx + 1),
          isCompleted: false,
          status: 'upcoming',
        }))
      : [
          {
            id: `m-new-1`,
            title: 'Initial Scope & Planning Signoff',
            targetDate: 'Next week',
            daysRemaining: 7,
            isCompleted: false,
            status: 'in_progress',
          },
          {
            id: `m-new-2`,
            title: 'Execution Phase 1 Delivery',
            targetDate: targetDate,
            daysRemaining: 45,
            isCompleted: false,
            status: 'upcoming',
          },
        ];

    const newGoal: GoalItem = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      category: category,
      description: description.trim() || `Achieve targeted outcome for ${title.trim()}`,
      progress: 0,
      targetDate: targetDate.trim() || 'Jun 30, 2025',
      priority: priority,
      status: 'not_started',
      iconType,
      iconTheme,
      successMetric: successMetric.trim() || '100% completion of key deliverables',
      nextAction: {
        title: nextActionTitle.trim() || 'Outline immediate next step',
        time: nextActionTime.trim() || 'Tomorrow',
      },
      connectedSources: [
        {
          id: `src-${Date.now()}-1`,
          type: 'calendar',
          name: 'Google Calendar',
          detail: 'Auto-linked schedule context',
          snippet: 'Nexorbit will monitor schedule density around this goal',
          time: 'Just now',
        },
        {
          id: `src-${Date.now()}-2`,
          type: 'drive',
          name: 'Google Drive',
          detail: 'Workspace documents linkage',
          snippet: 'Relevant documents will be automatically indexed',
          time: 'Just now',
        },
      ],
      milestones: defaultMilestones,
      aiReasoning: `Goal established in ${category} category. Nexorbit is actively watching relevant Gmail threads and Calendar slots to support execution.`,
    };

    onCreateGoal(newGoal);
    onClose();

    // Reset fields
    setTitle('');
    setDescription('');
    setCategory('Work');
    setSuccessMetric('');
    setAiPrompt('');
    setAiSuggestion(null);

    addToast({
      title: 'Goal Created Successfully',
      description: `"${newGoal.title}" added to your active alignment dashboard.`,
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden text-left z-10">
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-2xs">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Create New Goal
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Set a clear objective with intelligent tracking and synaptic context.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-6 pt-3 pb-1 flex items-center gap-2 bg-slate-50/30">
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
              mode === 'manual'
                ? 'bg-white shadow-2xs text-indigo-600 border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            Manual Creation
          </button>
          <button
            type="button"
            onClick={() => setMode('ai')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              mode === 'ai'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Fast Create</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'ai' ? (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                  <Bot className="h-4 w-4" />
                  <span>Describe what you want to achieve</span>
                </div>
                <p className="text-xs text-indigo-900/80 leading-relaxed">
                  Nexorbit will intelligently deduce the category, target timeline, key milestones, and recommended next actions from your natural language description.
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={4}
                  placeholder="e.g., Launch our new mobile app beta by end of Q3 and recruit 500 early testers..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full p-3.5 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleAiGenerate}
                  disabled={!aiPrompt.trim() || isGenerating}
                  leftIcon={isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 px-4 rounded-xl cursor-pointer"
                >
                  {isGenerating ? 'Analyzing with Nexorbit...' : 'Generate Goal Blueprint'}
                </Button>
              </div>

              {/* AI Suggestion Preview */}
              {aiSuggestion && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-indigo-100 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600">Generated Goal Plan</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                      {aiSuggestion.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-slate-900">{aiSuggestion.title}</div>
                    <p className="text-xs text-slate-600">{aiSuggestion.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10.5px] text-slate-400 block">Target Timeline</span>
                      <span className="font-semibold text-slate-800">{aiSuggestion.targetDate}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10.5px] text-slate-400 block">Next Action</span>
                      <span className="font-semibold text-slate-800">{aiSuggestion.nextAction.title}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleApplyAiSuggestion}
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 rounded-xl cursor-pointer shadow-2xs"
                  >
                    Use This Plan &amp; Finalize
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <form id="new-goal-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Goal Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Goal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Project Alpha Launch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Launch the new Project Alpha platform for beta users."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Learning">Learning</option>
                    <option value="Health">Health</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as GoalPriority)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="High priority">High priority</option>
                    <option value="Medium priority">Medium priority</option>
                    <option value="Low priority">Low priority</option>
                  </select>
                </div>
              </div>

              {/* Target Date & Success Metric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Target Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Jun 30, 2025"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Success Metric</label>
                  <input
                    type="text"
                    placeholder="e.g. 1,000 active beta users"
                    value={successMetric}
                    onChange={(e) => setSuccessMetric(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Next Action */}
              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Immediate Next Action</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Finalize pricing strategy"
                    value={nextActionTitle}
                    onChange={(e) => setNextActionTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Timing (e.g. Today)"
                    value={nextActionTime}
                    onChange={(e) => setNextActionTime(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </Button>

          {mode === 'manual' && (
            <Button
              type="submit"
              form="new-goal-form"
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 px-5 rounded-xl cursor-pointer shadow-2xs"
            >
              Create Goal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
