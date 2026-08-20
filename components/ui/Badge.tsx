'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'accent'
  | 'indigo'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline'
  | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/80',
    secondary: 'bg-[#181c27] text-slate-200 border-slate-800',
    accent: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    indigo: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    outline: 'bg-transparent text-slate-300 border-slate-700',
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: 'bg-slate-400',
    secondary: 'bg-slate-300',
    accent: 'bg-blue-400',
    indigo: 'bg-blue-400',
    info: 'bg-sky-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    outline: 'bg-slate-400',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] font-medium',
    md: 'px-2.5 py-0.5 text-xs font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        sizeClasses[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
};
