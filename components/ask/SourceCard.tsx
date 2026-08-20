'use client';

import React from 'react';
import { Mail, Calendar, HardDrive, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { SourceItem, ConnectorType } from './types';
import { cn } from '../../lib/utils';

export interface SourceCardProps {
  source: SourceItem;
  onClick?: (source: SourceItem) => void;
  className?: string;
}

export const SourceCard: React.FC<SourceCardProps> = ({
  source,
  onClick,
  className,
}) => {
  const getIcon = (type: ConnectorType) => {
    switch (type) {
      case 'gmail':
        return <Mail className="h-4 w-4 text-red-500 shrink-0" />;
      case 'calendar':
        return <Calendar className="h-4 w-4 text-blue-500 shrink-0" />;
      case 'drive':
        return <HardDrive className="h-4 w-4 text-amber-500 shrink-0" />;
      case 'notion':
        return <FileText className="h-4 w-4 text-slate-600 shrink-0" />;
      case 'github':
        return <FileText className="h-4 w-4 text-purple-500 shrink-0" />;
      default:
        return <FileText className="h-4 w-4 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div
      onClick={() => onClick?.(source)}
      className={cn(
        'p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group text-xs',
        className
      )}
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <div className="p-1.5 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5">
          {getIcon(source.connector)}
        </div>

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
              {source.title}
            </span>
            <span className="text-[10px] text-slate-400 font-mono shrink-0">
              {source.timestamp}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate">{source.snippet}</p>
        </div>
      </div>

      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-colors" />
    </div>
  );
};
