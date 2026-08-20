'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassSurface: React.FC<SurfaceProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'orbital-glass-surface rounded-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ElevatedGlassSurface: React.FC<SurfaceProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'orbital-glass-elevated rounded-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const InteractiveGlassSurface: React.FC<SurfaceProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'orbital-glass-interactive rounded-2xl cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const SoftSurface: React.FC<SurfaceProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-[#15181D]/60 backdrop-blur-xs border border-slate-800/80 rounded-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
