'use client';

import React from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Calendar,
  Activity,
  Layers,
} from 'lucide-react';
import { GoalItem } from './types';
import { Button } from '../ui/Button';

export interface AIInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: GoalItem[];
  onSelectGoal?: (goalId: string) => void;
}

export const AIInsightsModal: React.FC<AIInsightsModalProps> = ({
  isOpen,
  onClose,
  goals,
  onSelectGoal,
}) => {
  if (!isOpen) return null;

  const onTrackGoals = goals.filter((g) => g.status === 'on_track' && !g.isArchived);
  const atRiskGoals = goals.filter((g) => g.status === 'at_risk' && !g.isArchived);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden text-left z-10">
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-2xs">
              <Sparkles className="h-5 w-5 fill-indigo-500/10 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Nexorbit Intelligence
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">Predictive Velocity Report</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Quarterly Goal Trajectory &amp; Insights
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
              <span className="text-xs font-semibold text-emerald-800">On Track Velocity</span>
              <div className="text-2xl font-bold text-emerald-900 font-mono">
                {onTrackGoals.length} Goals
              </div>
              <p className="text-[11px] text-emerald-700">Health &amp; Fitness, Advanced AI, 24 Books</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
              <span className="text-xs font-semibold text-amber-800">Attention Required</span>
              <div className="text-2xl font-bold text-amber-900 font-mono">
                {atRiskGoals.length} Goals
              </div>
              <p className="text-[11px] text-amber-700">Project Alpha, Client Satisfaction</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
              <span className="text-xs font-semibold text-indigo-800">Average Pace</span>
              <div className="text-2xl font-bold text-indigo-900 font-mono">
                48%
              </div>
              <p className="text-[11px] text-indigo-700">↑ 12% increase compared to last month</p>
            </div>
          </div>

          {/* Deep Insight 1: Why Project Alpha needs attention */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4" />
                <span>Primary Risk Focus: Project Alpha Launch</span>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                High Priority
              </span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              Launch target is set for Jun 30 (45 days). Nexorbit identified that <strong>pricing tier signoff</strong> is currently blocking the QA and Dogfooding cohorts. Resolving the open pricing strategy email thread will unblock 2 downstream milestones immediately.
            </p>

            <div className="pt-1 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onSelectGoal?.('goal-1');
                }}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8 px-3 rounded-xl cursor-pointer shadow-2xs"
              >
                Open Project Alpha Workspace
              </Button>
            </div>
          </div>

          {/* Deep Insight 2: Client Satisfaction Optimization */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <TrendingUp className="h-4 w-4" />
              <span>Velocity Opportunity: Client Satisfaction (NPS 60+)</span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              Current progress is at 42%. Synced Gmail support metrics show an average response time of 3.8 hours for tier-1 accounts. Delegating routine ticket routing can increase high-touch meeting slots by 6 hours weekly.
            </p>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Synaptic updates parsed every 15 minutes across all connected connectors.
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-xs h-9 px-4 rounded-xl cursor-pointer"
          >
            Close Insights
          </Button>
        </div>
      </div>
    </div>
  );
};
