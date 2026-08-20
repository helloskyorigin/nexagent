'use client';

import React from 'react';
import { Mail, Calendar, HardDrive, FileText } from 'lucide-react';
import { InsightCardData, ConnectorType } from './types';
import { cn } from '../../lib/utils';

export interface InsightCardProps {
  insight: InsightCardData;
  index: number;
  onSelectSource?: (sourceId: string) => void;
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  index,
  onSelectSource,
  className,
}) => {
  return (
    <div
      className={cn(
        'py-4.5 flex flex-col space-y-1.5 transition-all text-xs font-sans',
        className
      )}
    >
      {/* Title & Status Indicator */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'h-2 w-2 rounded-full shrink-0',
            insight.priority === 'high' && 'bg-indigo-600',
            insight.priority === 'medium' && 'bg-slate-400',
            insight.priority === 'info' && 'bg-slate-300'
          )}
        />
        <h4 className="text-xs sm:text-[13px] font-semibold text-slate-900 tracking-tight">
          {insight.title}
        </h4>
      </div>

      {/* Explanation description */}
      <p className="text-xs sm:text-[12.5px] text-slate-600 leading-relaxed pl-4 font-normal">
        {insight.content}
      </p>

      {/* Muted Sources */}
      {insight.sources && insight.sources.length > 0 && (
        <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 pl-4">
          <span className="font-normal text-slate-400">Sources:</span>
          <div className="flex items-center gap-1.5">
            {insight.sources.map((src, idx) => (
              <React.Fragment key={src.id}>
                <button
                  onClick={() => onSelectSource?.(src.id)}
                  className="hover:text-indigo-600 hover:underline transition-colors font-medium cursor-pointer"
                >
                  {src.connectorName}
                </button>
                {idx < (insight.sources?.length ?? 0) - 1 && (
                  <span className="text-slate-300 select-none">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


