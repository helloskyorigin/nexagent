'use client';

import React from 'react';
import { CleanMyDayTab } from './types';
import { cn } from '../../lib/utils';

export interface DailyPlanTabsProps {
  activeTab: CleanMyDayTab;
  onSelectTab: (tab: CleanMyDayTab) => void;
  showCompleted: boolean;
  onToggleShowCompleted: (show: boolean) => void;
}

export const DailyPlanTabs: React.FC<DailyPlanTabsProps> = ({
  activeTab,
  onSelectTab,
  showCompleted,
  onToggleShowCompleted,
}) => {
  const tabs: { id: CleanMyDayTab; label: string }[] = [
    { id: 'plan', label: 'Plan' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'focus', label: 'Focus' },
  ];

  return (
    <div className="flex items-center justify-between border-b border-slate-200/80 pt-1 pb-0 mb-4">
      {/* Navigation Tab List */}
      <div className="flex items-center gap-6 sm:gap-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={cn(
                'pb-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer',
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Show Completed Toggle */}
      <div className="flex items-center gap-2.5 pb-2">
        <span className="text-xs font-medium text-slate-500">Show Completed</span>
        <button
          onClick={() => onToggleShowCompleted(!showCompleted)}
          type="button"
          role="switch"
          aria-checked={showCompleted}
          className={cn(
            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
            showCompleted ? 'bg-blue-600' : 'bg-slate-200'
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
              showCompleted ? 'translate-x-4' : 'translate-x-0'
            )}
          />
        </button>
      </div>
    </div>
  );
};
