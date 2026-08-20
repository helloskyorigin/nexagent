'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, disabled, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold text-slate-300 tracking-wide">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          rows={rows}
          className={cn(
            'w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#0f1118] text-slate-100 placeholder:text-slate-500 border border-slate-800 rounded-xl transition-all duration-150 resize-y min-h-[80px]',
            'focus:bg-[#15181D] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30',
            'disabled:bg-slate-900/50 disabled:text-slate-500 disabled:cursor-not-allowed',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs text-rose-400 font-medium">{error}</span>
        ) : hint ? (
          <span className="text-xs text-slate-500">{hint}</span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
