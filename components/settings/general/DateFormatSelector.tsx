'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { cn } from '../../../lib/utils';

export interface DateFormatOption {
  id: string;
  label: string;
  example: string;
}

export const DATE_FORMATS: DateFormatOption[] = [
  { id: 'MMM D, YYYY', label: 'May 16, 2025', example: 'MMM D, YYYY' },
  { id: 'DD/MM/YYYY', label: '16/05/2025', example: 'DD/MM/YYYY' },
  { id: 'MM/DD/YYYY', label: '05/16/2025', example: 'MM/DD/YYYY' },
  { id: 'YYYY-MM-DD', label: '2025-05-16', example: 'YYYY-MM-DD (ISO)' },
  { id: 'D MMM YYYY', label: '16 May 2025', example: 'D MMMM YYYY' },
];

export interface DateFormatSelectorProps {
  currentFormat: string;
  onChangeFormat: (format: string) => void;
  className?: string;
}

export const DateFormatSelector: React.FC<DateFormatSelectorProps> = ({
  currentFormat,
  onChangeFormat,
  className,
}) => {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = DATE_FORMATS.find((f) => f.id === currentFormat || f.label === currentFormat) || DATE_FORMATS[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (format: DateFormatOption) => {
    onChangeFormat(format.id);
    setIsOpen(false);
    addToast({
      type: 'success',
      title: 'Date Format Updated',
      description: `Dates will now appear formatted as "${format.label}".`,
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
          Date format
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Choose how dates are displayed.
        </p>
      </div>

      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full sm:w-[220px] flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Calendar className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="truncate">{selected.label}</span>
          </div>
          <ChevronDown
            className={cn('h-4 w-4 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-full sm:w-[220px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
            {DATE_FORMATS.map((format) => {
              const isCurrent = format.id === selected.id;
              return (
                <button
                  key={format.id}
                  onClick={() => handleSelect(format)}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer',
                    isCurrent
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <div>
                    <div className="font-semibold">{format.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{format.example}</div>
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
