'use client';

import React from 'react';
import { SourceItem } from './types';
import { SourceIcon } from './SourceIcons';
import { cn } from '../../lib/utils';

export interface SourceChipProps {
  source: SourceItem;
  onClick?: (source: SourceItem) => void;
  className?: string;
}

export const SourceChip: React.FC<SourceChipProps> = ({
  source,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(source)}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-700 bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/60 hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-pointer shadow-2xs select-none',
        className
      )}
      title={`View source: ${source.title}`}
    >
      <SourceIcon type={source.connector} className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate max-w-[110px] sm:max-w-none">{source.connectorName}</span>
    </button>
  );
};
