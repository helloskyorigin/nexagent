'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Filter, ArrowDownAZ, ArrowUpAZ, Calendar, HardDrive, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export type CategoryTab = 'Recent' | 'All' | 'Documents' | 'Bookmarks' | 'Images' | 'Code';
export type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'size-desc';

interface LibraryCategoryTabsProps {
  activeTab: CategoryTab;
  onTabChange: (tab: CategoryTab) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const TABS: CategoryTab[] = ['Recent', 'All', 'Documents', 'Bookmarks', 'Images', 'Code'];

export const LibraryCategoryTabs: React.FC<LibraryCategoryTabsProps> = ({
  activeTab,
  onTabChange,
  sortOption,
  onSortChange,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFilterOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  const sortOptionsList: { id: SortOption; label: string; icon: any }[] = [
    { id: 'newest', label: 'Newest First', icon: Calendar },
    { id: 'oldest', label: 'Oldest First', icon: Calendar },
    { id: 'name-asc', label: 'Name (A to Z)', icon: ArrowDownAZ },
    { id: 'name-desc', label: 'Name (Z to A)', icon: ArrowUpAZ },
    { id: 'size-desc', label: 'File Size (Largest)', icon: HardDrive },
  ];

  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-3">
      {/* Category Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase()}`}
              type="button"
              onClick={() => onTabChange(tab)}
              className={cn(
                'px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 shrink-0 select-none',
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Sort / Filter Control */}
      <div className="relative shrink-0" ref={filterRef}>
        <button
          id="library-filter-btn"
          type="button"
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium',
            'border border-white/[0.1] bg-[#11131c] text-slate-300 hover:text-white hover:bg-white/[0.06]',
            'transition-colors focus:outline-none',
            isFilterOpen && 'border-blue-500/40 text-blue-400'
          )}
        >
          <Filter size={14} className="text-slate-400" />
          <span>Filter</span>
        </button>

        {isFilterOpen && (
          <div
            className={cn(
              'absolute right-0 top-full mt-1.5 w-48 py-1.5 rounded-xl z-30',
              'bg-[#181b28] border border-white/[0.12] shadow-2xl shadow-black/80',
              'animate-in fade-in zoom-in-95 duration-150'
            )}
          >
            <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Sort By
            </div>
            {sortOptionsList.map((opt) => {
              const Icon = opt.icon;
              const isSelected = sortOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSortChange(opt.id);
                    setIsFilterOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left',
                    isSelected
                      ? 'text-blue-400 bg-blue-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]',
                    'transition-colors'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-slate-400" />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-blue-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
