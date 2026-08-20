'use client';

import React from 'react';
import { Mail, Calendar, FileText } from 'lucide-react';
import { CategoryFilter } from './types';
import { cn } from '../../lib/utils';

export interface CategoryFilterTabsProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  className?: string;
}

interface TabOption {
  id: CategoryFilter;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const TABS: TabOption[] = [
  { id: 'all', label: 'All' },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'files', label: 'Files', icon: FileText },
];

export const CategoryFilterTabs: React.FC<CategoryFilterTabsProps> = ({
  activeCategory,
  onSelectCategory,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto no-scrollbar py-1", className)}>
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeCategory === tab.id;

        return (
          <button
            key={tab.id}
            id={`filter-tab-${tab.id}`}
            onClick={() => onSelectCategory(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all duration-200 whitespace-nowrap cursor-pointer select-none",
              isActive
                ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold border border-[#E0E7FF] shadow-[0_1px_2px_rgba(79,70,229,0.06)]"
                : "bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/60 font-medium hover:border-slate-300/80"
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  isActive ? "text-[#4F46E5]" : "text-slate-400"
                )}
              />
            )}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
