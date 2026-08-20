'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, MoreVertical, Edit3, FolderPlus, Archive, Trash2 } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { cn } from '../../lib/utils';

export interface ChatHeaderProps {
  title?: string;
  onNavigateHome?: () => void;
  onRename?: () => void;
  onMoveToProject?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = 'Explain quantum computing simply',
  onNavigateHome,
  onRename,
  onMoveToProject,
  onArchive,
  onDelete,
  className,
}) => {
  const { addToast } = useToast();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <header
      className={cn(
        'w-full flex items-center justify-between h-14 px-4 sm:px-6 bg-[#000000] border-b border-white/[0.05] sticky top-0 z-20 shrink-0 text-[#ECECF1] select-none',
        className
      )}
    >
      {/* Left: Back Arrow + Conversation Title + Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-[80%] h-full">
        <button
          type="button"
          onClick={onNavigateHome}
          className="p-1.5 rounded-lg text-[#C5C5D2] hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          title="Back to Home"
          aria-label="Back to Home"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>

        <div className="flex items-center gap-1.5 text-[#ECECF1] font-semibold text-sm sm:text-base tracking-tight truncate min-w-0">
          <span className="truncate">{title}</span>
          <ChevronDown className="h-4 w-4 text-[#C5C5D2] shrink-0 opacity-70" />
        </div>
      </div>

      {/* Right: One minimal "More" button only */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="h-8 w-8 rounded-xl bg-[#171717] hover:bg-[#212121] border border-white/[0.08] text-[#C5C5D2] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Conversation actions"
            aria-label="Conversation actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMoreMenu && (
            <div
              className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-[#171717] border border-white/[0.1] shadow-2xl p-1.5 z-50 text-xs space-y-0.5"
              onMouseLeave={() => setShowMoreMenu(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  if (onRename) {
                    onRename();
                  } else {
                    addToast({
                      type: 'info',
                      title: 'Rename',
                      description: 'Enter new title for this conversation.',
                    });
                  }
                }}
                className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl text-[#ECECF1] hover:bg-white/[0.08] hover:text-white cursor-pointer font-medium transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5 text-[#C5C5D2]" />
                <span>Rename conversation</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  if (onMoveToProject) {
                    onMoveToProject();
                  } else {
                    addToast({
                      type: 'info',
                      title: 'Move to project',
                      description: 'Select target project workspace.',
                    });
                  }
                }}
                className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl text-[#ECECF1] hover:bg-white/[0.08] hover:text-white cursor-pointer font-medium transition-colors"
              >
                <FolderPlus className="h-3.5 w-3.5 text-[#C5C5D2]" />
                <span>Move to project</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  if (onArchive) {
                    onArchive();
                  } else {
                    addToast({
                      type: 'info',
                      title: 'Archived',
                      description: 'Conversation moved to archive.',
                    });
                  }
                }}
                className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl text-[#ECECF1] hover:bg-white/[0.08] hover:text-white cursor-pointer font-medium transition-colors"
              >
                <Archive className="h-3.5 w-3.5 text-[#C5C5D2]" />
                <span>Archive</span>
              </button>

              <div className="my-1 border-t border-white/[0.08]" />

              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  if (onDelete) {
                    onDelete();
                  } else {
                    addToast({
                      type: 'info',
                      title: 'Delete',
                      description: 'Conversation deleted.',
                    });
                  }
                }}
                className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 cursor-pointer font-medium transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                <span>Delete conversation</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

