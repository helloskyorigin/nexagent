'use client';

import React from 'react';
import { MemoryCategory } from '../../services/memory/memoryService';
import { cn } from '../../lib/utils';

interface MemoryCategoryTagProps {
  category: MemoryCategory;
  className?: string;
}

export const MemoryCategoryTag: React.FC<MemoryCategoryTagProps> = ({
  category,
  className,
}) => {
  const getStyles = () => {
    switch (category) {
      case 'Preferences':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Goals':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Context':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Facts':
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide',
        getStyles(),
        className
      )}
    >
      {category}
    </span>
  );
};
