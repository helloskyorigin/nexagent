'use client';

import React from 'react';
import { Users, Calendar, Heart, BookOpen, Scale, Sparkles } from 'lucide-react';
import { MemoryCategory } from './types';
import { cn } from '../../lib/utils';

export type CategoryTabOption = 'All' | MemoryCategory;

export interface MemoryCategoryTabsProps {
  activeTab: CategoryTabOption;
  onSelectTab: (tab: CategoryTabOption) => void;
}

export const MemoryCategoryTabs: React.FC<MemoryCategoryTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: { id: CategoryTabOption; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'All', label: 'All', icon: Sparkles },
    { id: 'People', label: 'People', icon: Users },
    { id: 'Projects', label: 'Projects', icon: Calendar },
    { id: 'Preferences', label: 'Preferences', icon: Heart },
    { id: 'Knowledge', label: 'Knowledge', icon: BookOpen },
    { id: 'Decisions', label: 'Decisions', icon: Scale },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        const IconComponent = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border select-none',
              isSelected
                ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                : 'bg-white border-slate-200/80 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
            )}
          >
            <IconComponent className={cn('h-3.5 w-3.5 shrink-0', isSelected ? 'text-slate-200' : 'text-slate-400')} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

