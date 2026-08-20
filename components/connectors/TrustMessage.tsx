'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TrustMessageProps {
  className?: string;
}

export const TrustMessage: React.FC<TrustMessageProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3 text-xs text-slate-600 font-medium',
        className
      )}
    >
      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
      <span>
        Your connections stay under your control. Nexorbit only uses connected services according to the permissions you explicitly approve.
      </span>
    </div>
  );
};

