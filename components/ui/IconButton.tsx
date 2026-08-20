'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ButtonVariant, ButtonSize } from './Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon: React.ReactNode;
  label?: string;
  'aria-label'?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      disabled,
      icon,
      label,
      'aria-label': ariaLabel,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const accessibleLabel = ariaLabel || label || 'Action button';

    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none rounded-xl shrink-0';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-blue-600 text-white shadow-xs hover:bg-blue-500 border border-blue-500/30',
      secondary: 'bg-[#181c27] text-slate-200 hover:bg-[#202534] hover:text-white border border-slate-800',
      outline: 'bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white border border-slate-700/80 shadow-xs',
      ghost: 'bg-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white',
      destructive: 'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30',
      danger: 'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-8 w-8 text-xs rounded-lg',
      md: 'h-9 w-9 text-xs rounded-xl',
      lg: 'h-11 w-11 text-sm rounded-xl',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-label={accessibleLabel}
        title={accessibleLabel}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin text-current" /> : icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
