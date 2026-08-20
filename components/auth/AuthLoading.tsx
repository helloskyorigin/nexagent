'use client';

import React from 'react';
import { NexorbitLogo } from './NexorbitLogo';

export interface AuthLoadingProps {
  headline?: string;
  subheadline?: string;
}

export const AuthLoading: React.FC<AuthLoadingProps> = ({
  headline = 'Initializing session',
  subheadline = 'Verifying workspace authorization...',
}) => {
  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col justify-center items-center p-6 antialiased select-none">
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto">
        {/* Animated Minimal Nexorbit Mark */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-slate-100/60 animate-pulse" />
          <NexorbitLogo variant="mark" size="xl" animated className="text-slate-900 relative z-10" />
        </div>

        {/* Minimal Typography */}
        <div className="space-y-1.5 pt-2">
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">
            {headline}
          </h2>
          <p className="text-sm text-slate-500 font-normal leading-relaxed">
            {subheadline}
          </p>
        </div>
      </div>
    </div>
  );
};
