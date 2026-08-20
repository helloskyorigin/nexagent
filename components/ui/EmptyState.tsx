'use client';

import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-[#15181D]/60 border border-slate-800/80', className)}>
      <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
        {icon || <Inbox className="h-6 w-6 stroke-[1.5]" />}
      </div>
      <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
      {description && <p className="text-xs text-slate-400 mt-1 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
