'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isSpinnerActive = isLoading || loading;

    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/25 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none rounded-xl active:scale-[0.98]';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-blue-600 text-white shadow-xs hover:bg-blue-500 active:bg-blue-700 border border-blue-500/30 hover:-translate-y-0.5 active:translate-y-0',
      secondary:
        'bg-[#181c27] text-slate-200 hover:text-white hover:bg-[#202534] border border-slate-800 shadow-2xs hover:-translate-y-0.5 active:translate-y-0',
      outline:
        'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-700/80 shadow-2xs hover:-translate-y-0.5 active:translate-y-0',
      ghost:
        'bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white active:bg-slate-800',
      destructive:
        'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 hover:border-rose-500/50 hover:-translate-y-0.5 active:translate-y-0',
      danger:
        'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 hover:border-rose-500/50 hover:-translate-y-0.5 active:translate-y-0',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
      md: 'h-9 px-4 text-xs gap-2 rounded-xl',
      lg: 'h-11 px-5 text-sm gap-2.5 rounded-xl',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isSpinnerActive}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isSpinnerActive ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-current shrink-0" />
        ) : (
          leftIcon
        )}
        {children && <span>{children}</span>}
        {!isSpinnerActive && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
