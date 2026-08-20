'use client';

import React from 'react';
import { LibraryItemType } from '../../services/library/libraryService';
import { cn } from '../../lib/utils';

interface LibraryItemBadgeProps {
  type: LibraryItemType;
  customLabel?: string;
  className?: string;
}

export const LibraryItemBadge: React.FC<LibraryItemBadgeProps> = ({
  type,
  customLabel,
  className,
}) => {
  const getStyles = () => {
    switch (type) {
      case 'bookmark':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'image':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'code':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'document':
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getLabel = () => {
    if (customLabel) return customLabel;
    switch (type) {
      case 'bookmark':
        return 'Bookmark';
      case 'image':
        return 'Image';
      case 'code':
        return 'Code';
      case 'document':
      default:
        return 'Document';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide select-none',
        getStyles(),
        className
      )}
    >
      {getLabel()}
    </span>
  );
};
