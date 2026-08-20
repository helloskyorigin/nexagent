'use client';

import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { GoalItem } from './types';

export interface GoalsOverviewCardProps {
  goals: GoalItem[];
  onFilterStatus?: (status: 'on_track' | 'at_risk' | 'not_started') => void;
}

export const GoalsOverviewCard: React.FC<GoalsOverviewCardProps> = ({
  goals,
  onFilterStatus,
}) => {
  const activeGoals = goals.filter((g) => !g.isArchived);
  const total = activeGoals.length;

  const onTrackCount = activeGoals.filter((g) => g.status === 'on_track').length;
  const atRiskCount = activeGoals.filter((g) => g.status === 'at_risk').length;
  const notStartedCount = activeGoals.filter((g) => g.status === 'not_started').length;

  // Calculate average progress
  const avgProgress =
    total > 0
      ? Math.round(activeGoals.reduce((acc, g) => acc + g.progress, 0) / total)
      : 0;

  // SVG Donut calculations
  // Circumference of radius 42 is 2 * PI * 42 ≈ 263.89
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  // Segments proportions
  const onTrackRatio = total > 0 ? onTrackCount / total : 0.5;
  const atRiskRatio = total > 0 ? atRiskCount / total : 0.33;
  const notStartedRatio = total > 0 ? notStartedCount / total : 0.17;

  const onTrackDash = onTrackRatio * circumference;
  const atRiskDash = atRiskRatio * circumference;
  const notStartedDash = notStartedRatio * circumference;

  // Offsets for stacked strokes
  const atRiskOffset = -onTrackDash;
  const notStartedOffset = -(onTrackDash + atRiskDash);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Goals Overview</h3>
        <div className="text-indigo-600">
          <Sparkles className="h-4 w-4 fill-indigo-500/10 text-indigo-500" />
        </div>
      </div>

      {/* Donut Chart & Legend */}
      <div className="flex items-center justify-between gap-4 pt-1">
        {/* SVG Circular Donut Chart */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="11"
            />

            {/* 1. On Track (Emerald) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#10B981"
              strokeWidth="11"
              strokeDasharray={`${Math.max(onTrackDash - 3, 0)} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />

            {/* 2. At Risk (Amber/Orange) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#F59E0B"
              strokeWidth="11"
              strokeDasharray={`${Math.max(atRiskDash - 3, 0)} ${circumference}`}
              strokeDashoffset={atRiskOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />

            {/* 3. Not Started (Slate) */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#CBD5E1"
              strokeWidth="11"
              strokeDasharray={`${Math.max(notStartedDash - 3, 0)} ${circumference}`}
              strokeDashoffset={notStartedOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight leading-none">
              {total}
            </span>
            <span className="text-[10.5px] text-slate-400 font-medium mt-0.5">Total Goals</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 flex-1 text-xs">
          <button
            onClick={() => onFilterStatus?.('on_track')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full text-left cursor-pointer group"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-125 transition-transform" />
            <span className="font-semibold text-slate-900">{onTrackCount}</span>
            <span className="text-slate-600">On Track</span>
          </button>

          <button
            onClick={() => onFilterStatus?.('at_risk')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full text-left cursor-pointer group"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0 group-hover:scale-125 transition-transform" />
            <span className="font-semibold text-slate-900">{atRiskCount}</span>
            <span className="text-slate-600">At Risk</span>
          </button>

          <button
            onClick={() => onFilterStatus?.('not_started')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full text-left cursor-pointer group"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300 shrink-0 group-hover:scale-125 transition-transform" />
            <span className="font-semibold text-slate-900">{notStartedCount}</span>
            <span className="text-slate-600">Not Started</span>
          </button>
        </div>
      </div>

      {/* Metric Breakdown Stats */}
      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
        <div>
          <span className="text-xs text-slate-600 block">Average Progress</span>
          <div className="text-xl font-bold text-slate-900 font-mono tracking-tight mt-0.5">
            {avgProgress}%
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>12% vs last month</span>
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-600 block">Completion Rate</span>
          <div className="text-xl font-bold text-slate-900 font-mono tracking-tight mt-0.5">
            30%
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>8% vs last month</span>
          </div>
        </div>
      </div>
    </div>
  );
};
