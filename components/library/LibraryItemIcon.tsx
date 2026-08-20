'use client';

import React from 'react';
import { FileText, Bookmark, Image as ImageIcon, Code2, Link as LinkIcon, FileCode } from 'lucide-react';
import { LibraryItemType } from '../../services/library/libraryService';
import { cn } from '../../lib/utils';

interface LibraryItemIconProps {
  type: LibraryItemType;
  fileType?: string;
  className?: string;
  size?: number;
}

export const LibraryItemIcon: React.FC<LibraryItemIconProps> = ({
  type,
  fileType,
  className,
  size = 20,
}) => {
  switch (type) {
    case 'bookmark':
      return (
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
            'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400',
            className
          )}
        >
          <Bookmark size={size} strokeWidth={1.8} />
        </div>
      );
    case 'image':
      return (
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
            'bg-purple-500/10 border border-purple-500/20 text-purple-400',
            className
          )}
        >
          <ImageIcon size={size} strokeWidth={1.8} />
        </div>
      );
    case 'code':
      return (
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
            'bg-white/[0.06] border border-white/[0.1] text-white',
            className
          )}
        >
          <Code2 size={size} strokeWidth={1.8} />
        </div>
      );
    case 'document':
    default:
      return (
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors',
            'bg-blue-500/10 border border-blue-500/20 text-blue-400',
            className
          )}
        >
          <FileText size={size} strokeWidth={1.8} />
        </div>
      );
  }
};
