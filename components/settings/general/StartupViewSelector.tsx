'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles, Home, MessageSquare, History, Target, Box, LayoutGrid } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { cn } from '../../../lib/utils';

export interface StartupViewOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const STARTUP_VIEWS: StartupViewOption[] = [
  { id: 'clean-my-day', label: 'Clean My Day', icon: <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> },
  { id: 'home', label: 'Home', icon: <Home className="h-3.5 w-3.5 text-blue-500" /> },
  { id: 'ask-my-world', label: 'Ask My World', icon: <MessageSquare className="h-3.5 w-3.5 text-purple-500" /> },
  { id: 'what-changed', label: 'What Changed', icon: <History className="h-3.5 w-3.5 text-amber-500" /> },
  { id: 'goals', label: 'Goals', icon: <Target className="h-3.5 w-3.5 text-emerald-500" /> },
  { id: 'memory', label: 'Memory', icon: <Box className="h-3.5 w-3.5 text-violet-500" /> },
  { id: 'connected-apps', label: 'Connected Apps', icon: <LayoutGrid className="h-3.5 w-3.5 text-cyan-500" /> },
];

export interface StartupViewSelectorProps {
  currentView: string;
  onChangeView: (viewId: string) => void;
  className?: string;
}

export const StartupViewSelector: React.FC<StartupViewSelectorProps> = ({
  currentView,
  onChangeView,
  className,
}) => {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = STARTUP_VIEWS.find((v) => v.id === currentView || v.label === currentView) || STARTUP_VIEWS[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (option: StartupViewOption) => {
    onChangeView(option.id);
    setIsOpen(false);
    addToast({
      type: 'success',
      title: 'Startup View Updated',
      description: `Default dashboard view set to "${option.label}".`,
    });
  };

  return (
    <div
      className={cn(
        'p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative',
        className
      )}
    >
      <div className="space-y-0.5">
        <h3 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
          Start-up view
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Choose what you want to see when you log in.
        </p>
      </div>

      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full sm:w-[220px] flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            {selected.icon}
            <span className="truncate">{selected.label}</span>
          </div>
          <ChevronDown
            className={cn('h-4 w-4 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-full sm:w-[220px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
            {STARTUP_VIEWS.map((option) => {
              const isCurrent = option.id === selected.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer',
                    isCurrent
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                  {isCurrent && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
