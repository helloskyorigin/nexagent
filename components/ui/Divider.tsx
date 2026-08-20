'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className,
}) => {
  if (orientation === 'vertical') {
    return <div className={cn('w-px bg-slate-200/80 self-stretch my-1', className)} />;
  }

  if (label) {
    return (
      <div className={cn('relative flex items-center my-4', className)}>
        <div className="flex-grow border-t border-slate-200/80"></div>
        <span className="flex-shrink mx-3 text-[11px] font-medium tracking-wider text-slate-400 uppercase">
          {label}
        </span>
        <div className="flex-grow border-t border-slate-200/80"></div>
      </div>
    );
  }

  return <hr className={cn('border-0 border-t border-slate-200/80 my-4', className)} />;
};
