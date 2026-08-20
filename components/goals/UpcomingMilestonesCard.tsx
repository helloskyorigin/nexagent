'use client';

import React from 'react';
import { Calendar, Sparkles, ChevronRight, CheckCircle2, Rocket, Users, Brain, Heart, BookOpen } from 'lucide-react';
import { MilestoneItem } from './types';

export interface UpcomingMilestonesCardProps {
  milestones: MilestoneItem[];
  onViewAll: () => void;
  onSelectMilestone?: (milestone: MilestoneItem) => void;
}

export const UpcomingMilestonesCard: React.FC<UpcomingMilestonesCardProps> = ({
  milestones,
  onViewAll,
  onSelectMilestone,
}) => {
  const getCategoryIcon = (title: string) => {
    if (title.includes('Alpha')) {
      return (
        <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
          <Rocket className="h-3.5 w-3.5" />
        </div>
      );
    }
    if (title.includes('Client')) {
      return (
        <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
          <Users className="h-3.5 w-3.5" />
        </div>
      );
    }
    if (title.includes('AI')) {
      return (
        <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
          <Brain className="h-3.5 w-3.5" />
        </div>
      );
    }
    return (
      <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
        <Calendar className="h-3.5 w-3.5" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-500" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Upcoming Milestones</h3>
        </div>
        <div className="text-indigo-600">
          <Sparkles className="h-4 w-4 fill-indigo-500/10 text-indigo-500" />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3 pt-1">
        {milestones.slice(0, 3).map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectMilestone?.(item)}
            className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {getCategoryIcon(item.title)}
              <div className="min-w-0">
                <div className="text-xs sm:text-[13px] font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-600">
                  {item.targetDate}
                </div>
              </div>
            </div>

            <span className="text-[11px] font-medium text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-md shrink-0">
              In {item.daysRemaining} days
            </span>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onViewAll}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 py-1.5 rounded-lg hover:bg-indigo-50/50 transition-colors cursor-pointer group"
        >
          <span>View all milestones</span>
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
