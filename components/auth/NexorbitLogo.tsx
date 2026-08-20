'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface NexorbitLogoProps {
  variant?: 'full' | 'mark' | 'wordmark' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
  textColor?: string;
}

export const NexorbitLogo: React.FC<NexorbitLogoProps> = ({
  variant = 'full',
  size = 'md',
  animated = false,
  className,
  textColor = 'text-slate-900',
}) => {
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizes = {
    sm: 'text-[11px] tracking-[0.28em]',
    md: 'text-xs tracking-[0.3em]',
    lg: 'text-sm tracking-[0.32em]',
    xl: 'text-base tracking-[0.36em]',
  };

  const OrbitIcon = (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        iconSizes[size],
        'shrink-0 select-none transition-transform duration-500',
        animated && 'animate-spin [animation-duration:12s]',
        className
      )}
    >
      <defs>
        <linearGradient id="nexOrbitBlue1" x1="10" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="nexOrbitBlue2" x1="80" y1="10" x2="20" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="orbGlow" x1="70" y1="20" x2="85" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>

      {/* Main Stylized Infinity Ribbon / Orbit 'N' */}
      <path
        d="M28 68 C 12 50, 18 28, 38 28 C 54 28, 62 48, 72 68 C 82 85, 92 65, 82 48 C 74 32, 60 22, 42 22 C 22 22, 8 42, 22 68 Z"
        fill="none"
        stroke="url(#nexOrbitBlue1)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Dynamic Crossing Ring */}
      <ellipse
        cx="50"
        cy="50"
        rx="42"
        ry="18"
        transform="rotate(-32 50 50)"
        stroke="url(#nexOrbitBlue2)"
        strokeWidth="3.5"
        strokeDasharray="120 20"
        className="opacity-90"
      />

      {/* Orbiting Satellite Sphere */}
      <circle
        cx="78"
        cy="26"
        r="6.5"
        fill="url(#orbGlow)"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
    </svg>
  );

  if (variant === 'mark') {
    return OrbitIcon;
  }

  if (variant === 'wordmark') {
    return (
      <span className={cn('font-extrabold uppercase font-sans select-none', textSizes[size], textColor)}>
        Nexorbit
      </span>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-3 select-none', className)}>
        {OrbitIcon}
        <span className={cn('font-extrabold uppercase font-sans text-slate-900 tracking-[0.32em] text-sm', textColor)}>
          Nexorbit
        </span>
      </div>
    );
  }

  return (
    <div className={cn('inline-flex items-center gap-3 select-none', className)}>
      {OrbitIcon}
      <span className={cn('font-extrabold uppercase font-sans tracking-[0.28em]', textSizes[size], textColor)}>
        Nexorbit
      </span>
    </div>
  );
};
