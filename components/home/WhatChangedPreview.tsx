'use client';

import React from 'react';
import { Calendar, Mail, FileText, Sparkles } from 'lucide-react';
import { ChangedItemData } from './types';
import { WHAT_CHANGED_ITEMS } from './mockData';
import { cn } from '../../lib/utils';

export interface WhatChangedPreviewProps {
  items?: ChangedItemData[];
  onItemClick?: (item: ChangedItemData) => void;
  onViewAll: () => void;
  className?: string;
}

export const WhatChangedPreview: React.FC<WhatChangedPreviewProps> = ({
  items = WHAT_CHANGED_ITEMS,
  onItemClick,
  onViewAll,
  className,
}) => {
  const renderConnectorIcon = (connector: ChangedItemData['connector']) => {
    switch (connector) {
      case 'calendar':
        return (
          <div className="h-9 w-9 rounded-2xl bg-blue-50/90 border border-blue-100 flex items-center justify-center shrink-0">
            <Calendar className="h-4.5 w-4.5 text-blue-600 stroke-[2.2]" />
          </div>
        );
      case 'gmail':
        return (
          <div className="h-9 w-9 rounded-2xl bg-emerald-50/90 border border-emerald-100 flex items-center justify-center shrink-0">
            <Mail className="h-4.5 w-4.5 text-emerald-600 stroke-[2.2]" />
          </div>
        );
      case 'drive':
        return (
          <div className="h-9 w-9 rounded-2xl bg-purple-50/90 border border-purple-100 flex items-center justify-center shrink-0">
            <FileText className="h-4.5 w-4.5 text-purple-600 stroke-[2.2]" />
          </div>
        );
      default:
        return (
          <div className="h-9 w-9 rounded-2xl bg-indigo-50/90 border border-indigo-100 flex items-center justify-center shrink-0">
            <Sparkles className="h-4.5 w-4.5 text-indigo-600 stroke-[2.2]" />
          </div>
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
            What Changed
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Important updates since your last visit.
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

      {/* Changes List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick ? onItemClick(item) : onViewAll()}
            className="flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-slate-50/90 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {renderConnectorIcon(item.connector)}
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {item.title}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">
                  {item.subtitle}
                </div>
              </div>
            </div>

            <span className="text-[11.5px] font-medium text-slate-400 shrink-0">
              {item.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
