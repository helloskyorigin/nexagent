'use client';

import React from 'react';
import { User, Sliders, Target, Sparkles } from 'lucide-react';
import { MemoryCategory } from '../../services/memory/memoryService';
import { cn } from '../../lib/utils';

interface MemoryCategoryIconProps {
  category: MemoryCategory;
  className?: string;
  size?: number;
}

export const MemoryCategoryIcon: React.FC<MemoryCategoryIconProps> = ({
  category,
  className,
  size = 18,
}) => {
  switch (category) {
    case 'Preferences':
      return (
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
            'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
            className
          )}
        >
          <Sliders size={size} strokeWidth={2} />
        </div>
      );
    case 'Goals':
      return (
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
            'bg-purple-500/10 border border-purple-500/20 text-purple-400',
            className
          )}
        >
          <Target size={size} strokeWidth={2} />
        </div>
      );
    case 'Context':
      return (
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
            'bg-sky-500/10 border border-sky-500/20 text-sky-400',
            className
          )}
        >
          <Sparkles size={size} strokeWidth={2} />
        </div>
      );
    case 'Facts':
    default:
      return (
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
            'bg-blue-500/10 border border-blue-500/20 text-blue-400',
            className
          )}
        >
          <User size={size} strokeWidth={2} />
        </div>
      );
  }
};
