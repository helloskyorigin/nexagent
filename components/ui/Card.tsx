'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'soft';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      title,
      subtitle,
      description,
      action,
      variant = 'default',
      padding = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-[#15181D]/90 border border-slate-800/80 shadow-md backdrop-blur-md',
      elevated: 'bg-[#1a1e2c]/95 border border-slate-700/80 shadow-lg backdrop-blur-lg',
      bordered: 'bg-[#15181D]/90 border border-slate-800 shadow-2xs backdrop-blur-md',
      soft: 'bg-[#0f1118]/80 border border-slate-800/60 backdrop-blur-xs',
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-5',
      lg: 'p-6 sm:p-8',
    };

    const subText = subtitle || description;

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl transition-all duration-150', variants[variant], paddings[padding], className)}
        {...props}
      >
        {(title || subText || action) && (
          <div className="flex items-start justify-between gap-3 mb-3.5 pb-2 border-b border-slate-800/80">
            <div>
              {title && <h3 className="text-xs font-semibold text-slate-100">{title}</h3>}
              {subText && <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{subText}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
