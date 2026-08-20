'use client';

import React from 'react';
import { AlertCircle, UserX, Users } from 'lucide-react';
import { FocusItemData } from './types';
import { TODAY_FOCUS_ITEMS } from './mockData';
import { cn } from '../../lib/utils';

export interface TodayFocusProps {
  items?: FocusItemData[];
  onItemAction: (item: FocusItemData) => void;
  onViewAll: () => void;
  className?: string;
}

export const TodayFocus: React.FC<TodayFocusProps> = ({
  items = TODAY_FOCUS_ITEMS,
  onItemAction,
  onViewAll,
  className,
}) => {
  const renderItemIcon = (type: FocusItemData['iconType']) => {
    switch (type) {
      case 'conflict':
        return (
          <div className="h-9 w-9 rounded-full bg-orange-50/90 border border-orange-100 flex items-center justify-center shrink-0">
            <AlertCircle className="h-4.5 w-4.5 text-orange-500 stroke-[2.2]" />
          </div>
        );
      case 'client':
        return (
          <div className="h-9 w-9 rounded-full bg-amber-50/90 border border-amber-100 flex items-center justify-center shrink-0">
            <UserX className="h-4.5 w-4.5 text-amber-500 stroke-[2.2]" />
          </div>
        );
      case 'meeting':
        return (
          <div className="h-9 w-9 rounded-full bg-blue-50/90 border border-blue-100 flex items-center justify-center shrink-0">
            <Users className="h-4.5 w-4.5 text-blue-600 stroke-[2.2]" />
          </div>
        );
    }
  };

  const renderActionButton = (item: FocusItemData) => {
    switch (item.actionType) {
      case 'review':
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onItemAction(item);
            }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold transition-colors cursor-pointer border border-orange-100/80 shrink-0"
          >
            <span>Review</span>
            <span>→</span>
          </button>
        );
      case 'open':
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onItemAction(item);
            }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition-colors cursor-pointer border border-amber-100/80 shrink-0"
          >
            <span>Open</span>
            <span>→</span>
          </button>
        );
      case 'prepare':
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onItemAction(item);
            }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-colors cursor-pointer border border-blue-100/80 shrink-0"
          >
            <span>Prepare</span>
            <span>→</span>
          </button>
        );
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-950 tracking-tight">
            Today&apos;s Focus
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Things that may need your attention.
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer pt-0.5"
        >
          View all
        </button>
      </div>

      {/* Focus List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemAction(item)}
            className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-slate-50/90 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {renderItemIcon(item.iconType)}
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {item.title}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">
                  {item.subtitle}
                </div>
              </div>
            </div>

            {renderActionButton(item)}
          </div>
        ))}
      </div>
    </div>
  );
};
