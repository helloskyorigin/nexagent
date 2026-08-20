'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delayMs?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delayMs = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delayMs);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positions = {
    top: '-top-9 left-1/2 -translate-x-1/2',
    bottom: '-bottom-9 left-1/2 -translate-x-1/2',
    left: 'top-1/2 -left-2 -translate-x-full -translate-y-1/2',
    right: 'top-1/2 -right-2 translate-x-full -translate-y-1/2',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2.5 py-1 text-xs font-medium text-white bg-slate-900 rounded-md shadow-md whitespace-nowrap pointer-events-none transition-opacity duration-150 animate-fadeIn',
            positions[position]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
