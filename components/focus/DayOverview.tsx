'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

export interface DayOverviewProps {
  totalItems?: number;
  highCount?: number;
  mediumCount?: number;
  lowCount?: number;
  doneCount?: number;
  dateString?: string;
}

export const DayOverview: React.FC<DayOverviewProps> = ({
  totalItems = 6,
  highCount = 2,
  mediumCount = 2,
  lowCount = 2,
  doneCount = 2,
  dateString = 'May 11, 2024',
}) => {
  // Donut chart stroke math
  const size = 110;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const total = highCount + mediumCount + lowCount + doneCount || 1;
  const highDash = (highCount / total) * circumference;
  const mediumDash = (mediumCount / total) * circumference;
  const lowDash = (lowCount / total) * circumference;
  const doneDash = (doneCount / total) * circumference;

  const highOffset = 0;
  const mediumOffset = -highDash;
  const lowOffset = -(highDash + mediumDash);
  const doneOffset = -(highDash + mediumDash + lowDash);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span>Day Overview</span>
        </h3>
        <span className="text-xs text-slate-400 font-normal">{dateString}</span>
      </div>

      {/* Donut & Legend Grid */}
      <div className="flex items-center justify-between gap-4 pt-1">
        {/* Ring / Donut Chart */}
        <div className="relative h-28 w-28 flex items-center justify-center shrink-0">
          <svg className="h-28 w-28 -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="stroke-slate-100 fill-none"
              strokeWidth={strokeWidth}
            />
            {/* Done Segment (Blue) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="stroke-blue-500 fill-none transition-all duration-500"
              strokeWidth={strokeWidth}
              strokeDasharray={`${doneDash} ${circumference}`}
              strokeDashoffset={doneOffset}
            />
            {/* Low Segment (Green) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="stroke-emerald-400 fill-none transition-all duration-500"
              strokeWidth={strokeWidth}
              strokeDasharray={`${lowDash} ${circumference}`}
              strokeDashoffset={lowOffset}
            />
            {/* Medium Segment (Orange/Amber) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="stroke-amber-400 fill-none transition-all duration-500"
              strokeWidth={strokeWidth}
              strokeDasharray={`${mediumDash} ${circumference}`}
              strokeDashoffset={mediumOffset}
            />
            {/* High Segment (Red) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              className="stroke-rose-500 fill-none transition-all duration-500"
              strokeWidth={strokeWidth}
              strokeDasharray={`${highDash} ${circumference}`}
              strokeDashoffset={highOffset}
            />
          </svg>

          {/* Center Text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
              {totalItems}
            </span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5">
              Items
            </span>
          </div>
        </div>

        {/* Color Legend */}
        <div className="flex-1 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
              <span className="text-slate-600 font-medium">High</span>
            </div>
            <span className="font-semibold text-slate-900">{highCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-slate-600 font-medium">Medium</span>
            </div>
            <span className="font-semibold text-slate-900">{mediumCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-slate-600 font-medium">Low</span>
            </div>
            <span className="font-semibold text-slate-900">{lowCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
              <span className="text-slate-600 font-medium">Done</span>
            </div>
            <span className="font-semibold text-slate-900">{doneCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
