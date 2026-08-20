'use client';

import React from 'react';
import { FileText, Bookmark, Image as ImageIcon, Code2 } from 'lucide-react';
import { LibraryItemType } from '../../services/library/libraryService';
import { cn } from '../../lib/utils';

interface LibrarySummaryCardsProps {
  counts: {
    documents: number;
    bookmarks: number;
    images: number;
    code: number;
  };
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const LibrarySummaryCards: React.FC<LibrarySummaryCardsProps> = ({
  counts,
  activeCategory,
  onSelectCategory,
}) => {
  const cards = [
    {
      id: 'Documents',
      title: 'Documents',
      subtitle: 'Notes, docs, PDFs',
      count: counts.documents,
      icon: FileText,
      iconBoxBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      activeBorder: 'border-blue-500/50 bg-[#141824]',
    },
    {
      id: 'Bookmarks',
      title: 'Bookmarks',
      subtitle: 'Saved links',
      count: counts.bookmarks,
      icon: Bookmark,
      iconBoxBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      activeBorder: 'border-emerald-500/50 bg-[#141824]',
    },
    {
      id: 'Images',
      title: 'Images',
      subtitle: 'Screenshots, photos',
      count: counts.images,
      icon: ImageIcon,
      iconBoxBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      activeBorder: 'border-purple-500/50 bg-[#141824]',
    },
    {
      id: 'Code',
      title: 'Code Snippets',
      subtitle: 'Scripts, snippets',
      count: counts.code,
      icon: Code2,
      iconBoxBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      activeBorder: 'border-amber-500/50 bg-[#141824]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeCategory === card.id;

        return (
          <button
            key={card.id}
            id={`summary-card-${card.id.toLowerCase()}`}
            type="button"
            onClick={() => onSelectCategory(isActive ? 'All' : card.id)}
            className={cn(
              'flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 group relative',
              'bg-[#11131c]/90 border border-white/[0.07] hover:border-white/[0.14] hover:bg-[#151824]/90',
              isActive && card.activeBorder
            )}
          >
            {/* Category Icon */}
            <div
              className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 group-hover:scale-105 transition-transform',
                card.iconBoxBg
              )}
            >
              <Icon size={20} strokeWidth={1.8} />
            </div>

            {/* Content: Real Count & Label */}
            <div className="min-w-0 flex-1">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-none">
                {card.count}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1 truncate">
                {card.title}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5 hidden sm:block">
                {card.subtitle}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
