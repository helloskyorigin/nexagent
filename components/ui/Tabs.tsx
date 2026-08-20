'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'line' | 'pills' | 'soft';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  variant = 'line',
  className,
}) => {
  if (variant === 'pills' || variant === 'soft') {
    return (
      <div className={cn('flex items-center gap-1.5 p-1 bg-[#15181D]/80 rounded-xl border border-slate-800/80', className)}>
        {items.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 select-none',
                isActive
                  ? 'bg-[#1e2332] text-white shadow-xs border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span className="ml-1">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-6 border-b border-slate-800/80', className)}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 pb-2.5 text-xs font-semibold border-b-2 transition-all duration-150 select-none -mb-px',
              isActive
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700',
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && <span className="ml-1">{tab.badge}</span>}
          </button>
        );
      })}
    </div>
  );
};
