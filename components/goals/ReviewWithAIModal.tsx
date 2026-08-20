'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Brain,
  Zap,
} from 'lucide-react';
import { GoalItem } from './types';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export interface ReviewWithAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: GoalItem[];
  onApplyOptimization?: (goalId: string) => void;
}

export const ReviewWithAIModal: React.FC<ReviewWithAIModalProps> = ({
  isOpen,
  onClose,
  goals,
  onApplyOptimization,
}) => {
  const { addToast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [appliedRecommendations, setAppliedRecommendations] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleApply = (id: string, title: string) => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setAppliedRecommendations((prev) => [...prev, id]);
      addToast({
        title: 'Schedule Optimized',
        description: `Applied: ${title}`,
        type: 'success',
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden text-left z-10">
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-2xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Nexorbit AI Brain
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">Quarterly Sync Audit</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                AI Goal Alignment &amp; Bandwidth Review
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
          {/* Executive Summary Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-indigo-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
                <Brain className="h-4 w-4" />
                <span>Executive Synthesis</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                Quarterly Target Confidence: 74%
              </span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed">
              Based on your synced Workspace calendar (18 hrs of meetings this week), 4 active Drive specifications, and 23 unread SLA emails, Nexorbit forecasts that <strong>3 of your 6 goals</strong> are on trajectory for on-time delivery.
            </p>
          </div>

          {/* Diagnostic Bottlenecks */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-600">Capacity &amp; Schedule Bottlenecks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>Project Alpha SLA Dependency</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  3 unresolved client threads in Gmail are delaying Tier 1 pricing sign-off. High risk of missing Jun 30 beta window if not closed today.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span>Meeting Overlap Window</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thursday has 6 consecutive status syncs, leaving zero focus blocks for deep architecture review.
                </p>
              </div>
            </div>
          </div>

          {/* Actionable Interventions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-600">Recommended Autonomous Adjustments</h3>
            
            <div className="space-y-2.5">
              {/* Item 1 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    Protect 2h Deep Work on Thursday Morning
                  </div>
                  <p className="text-xs text-slate-500">
                    Compress recurring status check-ins and reserve 9:00 AM – 11:00 AM for Alpha pricing strategy.
                  </p>
                </div>

                <Button
                  variant={appliedRecommendations.includes('rec-1') ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={appliedRecommendations.includes('rec-1')}
                  onClick={() => handleApply('rec-1', '2h Focus Block Reserved')}
                  className="text-xs h-8 px-3 rounded-lg shrink-0 cursor-pointer shadow-2xs"
                >
                  {appliedRecommendations.includes('rec-1') ? 'Protected ✓' : 'Auto-Protect Block'}
                </Button>
              </div>

              {/* Item 2 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    Batch Learn Advanced AI Study to Saturdays
                  </div>
                  <p className="text-xs text-slate-500">
                    Move AI coding modules to weekend mornings where context switching is 80% lower.
                  </p>
                </div>

                <Button
                  variant={appliedRecommendations.includes('rec-2') ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={appliedRecommendations.includes('rec-2')}
                  onClick={() => handleApply('rec-2', 'Weekend Study Pacing Scheduled')}
                  className="text-xs h-8 px-3 rounded-lg shrink-0 cursor-pointer shadow-2xs"
                >
                  {appliedRecommendations.includes('rec-2') ? 'Scheduled ✓' : 'Apply Pacing'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Nexorbit AI Cognitive Model v3.2 • Workspace Synchronized
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-xs h-9 px-4 rounded-xl cursor-pointer"
          >
            Close Review
          </Button>
        </div>
      </div>
    </div>
  );
};
