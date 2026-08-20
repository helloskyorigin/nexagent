'use client';

import React from 'react';
import { AlertCircle, ArrowRight, X } from 'lucide-react';
import { AuthErrorInfo } from './authErrors';
import { cn } from '../../lib/utils';

export interface AuthErrorBannerProps {
  error: AuthErrorInfo | string | null;
  onDismiss?: () => void;
  onAction?: (actionType?: string) => void;
  actionLabel?: string;
  className?: string;
}

export const AuthErrorBanner: React.FC<AuthErrorBannerProps> = ({
  error,
  onDismiss,
  onAction,
  actionLabel,
  className,
}) => {
  if (!error) return null;

  const errorInfo: AuthErrorInfo =
    typeof error === 'string'
      ? { code: 'custom', message: error }
      : error;

  const showSignInAction = errorInfo.isExistingAccount || errorInfo.actionType === 'signin';
  const resolvedActionLabel = actionLabel || (showSignInAction ? 'Sign in instead' : undefined);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-rose-950 text-xs shadow-3xs animate-in fade-in slide-in-from-top-1 duration-150 relative overflow-hidden',
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="h-5 w-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="h-3.5 w-3.5 stroke-[2.25]" />
        </div>

        <div className="flex-1 min-w-0 pr-4 space-y-1">
          {errorInfo.title && (
            <p className="font-semibold text-rose-900 leading-snug">
              {errorInfo.title}
            </p>
          )}
          <p className="text-rose-800/90 font-normal leading-relaxed">
            {errorInfo.message}
          </p>

          {resolvedActionLabel && onAction && (
            <div className="pt-1.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onAction(errorInfo.actionType || 'signin')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-100/70 border border-rose-200 text-rose-900 font-semibold text-[11px] shadow-3xs cursor-pointer transition-colors"
              >
                <span>{resolvedActionLabel}</span>
                <ArrowRight className="h-3 w-3 text-rose-600" />
              </button>
            </div>
          )}
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss message"
            className="absolute top-3 right-3 text-rose-400 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-100/60 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
