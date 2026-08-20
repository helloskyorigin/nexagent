'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { StatusIndicator, StatusState } from './StatusIndicator';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: StatusState;
  className?: string;
  badge?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  status,
  className,
  badge,
}) => {
  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-xs font-semibold',
    lg: 'h-11 w-11 text-sm font-semibold',
    xl: 'h-14 w-14 text-base font-semibold',
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-block shrink-0">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className={cn('rounded-full object-cover border border-slate-200/80', sizes[size], className)}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-slate-900 text-indigo-300 font-semibold flex items-center justify-center border border-slate-800 select-none shadow-xs',
            sizes[size],
            className
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-white p-0.5 rounded-full border border-slate-200">
          <StatusIndicator status={status} size="sm" />
        </div>
      )}
      {badge && <div className="absolute -bottom-0.5 -right-0.5">{badge}</div>}
    </div>
  );
};
