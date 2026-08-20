'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  action,
  className,
}) => {
  return (
    <div className={cn('flex items-start justify-between gap-4 pb-3 border-b border-slate-800/80', className)}>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold tracking-tight text-slate-100">{title}</h2>
          {badge}
        </div>
        {subtitle && <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 pt-0.5">{action}</div>}
    </div>
  );
};
