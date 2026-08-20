'use client';

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  Rocket,
  Users,
  Brain,
  Heart,
  BookOpen,
} from 'lucide-react';
import { MilestoneItem } from './types';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

export interface MilestonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: MilestoneItem[];
  onSelectMilestoneGoal?: (goalTitle: string) => void;
}

export const MilestonesModal: React.FC<MilestonesModalProps> = ({
  isOpen,
  onClose,
  milestones,
  onSelectMilestoneGoal,
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  if (!isOpen) return null;

  const filtered = milestones.filter((m) => {
    if (filter === 'upcoming') return !m.isCompleted;
    if (filter === 'completed') return m.isCompleted;
    return true;
  });

  const getMilestoneIcon = (title: string) => {
    if (title.includes('Alpha')) return <Rocket className="h-4 w-4 text-purple-600" />;
    if (title.includes('Client')) return <Users className="h-4 w-4 text-emerald-600" />;
    if (title.includes('AI')) return <Brain className="h-4 w-4 text-amber-600" />;
    if (title.includes('Transformation') || title.includes('Health')) return <Heart className="h-4 w-4 text-rose-600" />;
    return <BookOpen className="h-4 w-4 text-blue-600" />;
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
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-2xs">
              <Calendar className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                All Goal Milestones Roadmap
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Unified cross-goal timeline with synchronized deadlines.
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

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2 bg-white">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            All ({milestones.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={cn(
              'px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
              filter === 'upcoming'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            Upcoming ({milestones.filter((m) => !m.isCompleted).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={cn(
              'px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer',
              filter === 'completed'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            Completed ({milestones.filter((m) => m.isCompleted).length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.goalTitle && onSelectMilestoneGoal) {
                  onClose();
                  onSelectMilestoneGoal(item.goalTitle);
                }
              }}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getMilestoneIcon(item.title)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Goal: {item.goalTitle || 'Primary Alignment'} • Target: {item.targetDate}
                  </div>
                </div>
              </div>

              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0">
                In {item.daysRemaining} days
              </span>
            </div>
          ))}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-xs h-9 px-4 rounded-xl cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
