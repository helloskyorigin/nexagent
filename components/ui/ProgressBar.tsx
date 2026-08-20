'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export type ProgressBarVariant = 'default' | 'accent' | 'indigo' | 'info' | 'success' | 'warning' | 'danger';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showValueLabel?: boolean;
  variant?: ProgressBarVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValueLabel = false,
  variant = 'accent',
  size = 'md',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variants: Record<ProgressBarVariant, string> = {
    default: 'bg-slate-700',
    accent: 'bg-indigo-600',
    indigo: 'bg-indigo-600',
    info: 'bg-sky-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(label || showValueLabel) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          {showValueLabel && (
            <span className="font-semibold text-slate-600">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60', sizes[size])}>
        <div
          className={cn('h-full transition-all duration-300 ease-out rounded-full', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
