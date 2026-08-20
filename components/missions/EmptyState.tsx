'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionButtonText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionButtonText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-8 text-center rounded-2xl bg-[#15181D] border border-dashed border-slate-800 space-y-3.5',
        className
      )}
    >
      <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-sm text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      {actionButtonText && onAction && (
        <div className="pt-1">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <span>{actionButtonText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
