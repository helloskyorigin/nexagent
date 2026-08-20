'use client';

import React from 'react';
import { AlertTriangle, Clock, Calendar, Info, ArrowRight } from 'lucide-react';
import { FindingItem, SourceItem } from './types';
import { SourceChip } from './SourceChip';
import { cn } from '../../lib/utils';

export interface FindingCardProps {
  finding: FindingItem;
  onActionClick: (finding: FindingItem) => void;
  onSourceClick: (source: SourceItem) => void;
  className?: string;
}

export const FindingCard: React.FC<FindingCardProps> = ({
  finding,
  onActionClick,
  onSourceClick,
  className,
}) => {
  const renderIcon = () => {
    switch (finding.type) {
      case 'conflict':
        return (
          <div className="h-8 w-8 rounded-full bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60 shadow-2xs">
            <AlertTriangle className="h-4 w-4" />
          </div>
        );
      case 'pending':
        return (
          <div className="h-8 w-8 rounded-full bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60 shadow-2xs">
            <Clock className="h-4 w-4" />
          </div>
        );
      case 'meeting':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60 shadow-2xs">
            <Calendar className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200/60 shadow-2xs">
            <Info className="h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-4 sm:p-4.5 space-y-3 hover:border-indigo-100/90 transition-all duration-200',
        className
      )}
    >
      {/* Top Row: Icon + Title + Timestamp */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {renderIcon()}
          <h4 className="text-[14px] font-bold text-slate-900 tracking-tight truncate">
            {finding.title}
          </h4>
        </div>
        <span className="text-xs text-slate-400 font-normal shrink-0">
          {finding.timestamp}
        </span>
      </div>

      {/* Description Text */}
      <p className="text-[13px] text-slate-600 leading-relaxed font-normal pl-0.5 sm:pl-1">
        {finding.description}
      </p>

      {/* Bottom Row: Source Chips (Left) + Action Button (Right) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-50">
        {/* Sources on Left */}
        <div className="flex flex-wrap items-center gap-1.5">
          {finding.sources.map((src) => (
            <SourceChip
              key={src.id}
              source={src}
              onClick={onSourceClick}
            />
          ))}
        </div>

        {/* Action Button on Right */}
        <button
          type="button"
          onClick={() => onActionClick(finding)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 transition-all cursor-pointer shadow-2xs shrink-0"
        >
          <span>{finding.actionLabel.replace(' →', '')}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
