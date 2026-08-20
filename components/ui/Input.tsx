'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-300 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full h-10 px-3.5 py-2 text-xs sm:text-sm bg-[#0f1118] text-slate-100 placeholder:text-slate-500 border border-slate-800 rounded-xl transition-all duration-150 shadow-2xs',
              'focus:bg-[#15181D] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30',
              'disabled:bg-slate-900/50 disabled:text-slate-500 disabled:cursor-not-allowed',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
              leftIcon && 'pl-9.5',
              rightIcon && 'pr-9.5',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-slate-400 flex items-center">{rightIcon}</div>
          )}
        </div>
        {error ? (
          <span className="text-xs text-rose-400 font-medium">{error}</span>
        ) : hint ? (
          <span className="text-xs text-slate-500">{hint}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
