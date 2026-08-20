'use client';

import React from 'react';
import { Clock, Calendar, CheckSquare, Coffee, Video } from 'lucide-react';
import { DailyPlanItem } from './types';
import { cn } from '../../lib/utils';

export interface TimeBlocksViewProps {
  items: DailyPlanItem[];
  onSelectItem: (item: DailyPlanItem) => void;
}

export const TimeBlocksView: React.FC<TimeBlocksViewProps> = ({ items, onSelectItem }) => {
  const hours = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Today&apos;s Time Blocks</h3>
          <p className="text-xs text-slate-600">Hourly visual distribution of your day</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-purple-500" />
            <span>Meetings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
            <span>Deep Work</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
            <span>Breaks</span>
          </div>
        </div>
      </div>

      {/* Hourly Grid */}
      <div className="space-y-3">
        {hours.map((hour, idx) => {
          const matchingItems = items.filter((item) => item.time.startsWith(hour.split(':')[0]));

          return (
            <div key={idx} className="flex items-start gap-4 py-2 border-b border-slate-50 last:border-0">
              <div className="w-16 text-xs font-semibold text-slate-600 shrink-0 pt-1">
                {hour}
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 min-h-[44px]">
                {matchingItems.length > 0 ? (
                  matchingItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className={cn(
                        'p-2.5 rounded-xl border text-left transition-all hover:shadow-2xs cursor-pointer flex items-center justify-between gap-2',
                        item.type === 'meeting'
                          ? 'bg-purple-50/70 border-purple-200 text-purple-950'
                          : item.type === 'break'
                          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                          : 'bg-indigo-50/50 border-indigo-200 text-indigo-950'
                      )}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{item.title}</div>
                        <div className="text-[11px] opacity-75">{item.time} ({item.duration})</div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/80 border border-slate-200/50 shrink-0">
                        {item.priority}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="h-full rounded-lg border border-dashed border-slate-200 bg-slate-50/30 flex items-center px-3 text-[11px] text-slate-600">
                    Open focus buffer
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
