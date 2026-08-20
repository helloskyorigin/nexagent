'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, Search, ChevronDown, Check } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { cn } from '../../../lib/utils';

export interface TimezoneOption {
  id: string;
  label: string;
  city: string;
  offset: string;
}

export const TIMEZONES: TimezoneOption[] = [
  { id: 'Asia/Kolkata', label: '(GMT+5:30) Asia/Kolkata', city: 'Kolkata, New Delhi, Mumbai', offset: '+05:30' },
  { id: 'America/Los_Angeles', label: '(GMT-8:00) Pacific Time (US & Canada)', city: 'San Francisco, Seattle, LA', offset: '-08:00' },
  { id: 'America/New_York', label: '(GMT-5:00) Eastern Time (US & Canada)', city: 'New York, Boston, Miami', offset: '-05:00' },
  { id: 'Europe/London', label: '(GMT+0:00) UTC / London', city: 'London, Dublin, Lisbon', offset: '+00:00' },
  { id: 'Europe/Berlin', label: '(GMT+1:00) Central European Time', city: 'Berlin, Paris, Amsterdam', offset: '+01:00' },
  { id: 'Asia/Dubai', label: '(GMT+4:00) Dubai, Abu Dhabi', city: 'Dubai, Muscat', offset: '+04:00' },
  { id: 'Asia/Singapore', label: '(GMT+8:00) Singapore, Hong Kong', city: 'Singapore, Hong Kong, Beijing', offset: '+08:00' },
  { id: 'Asia/Tokyo', label: '(GMT+9:00) Tokyo, Seoul', city: 'Tokyo, Osaka, Seoul', offset: '+09:00' },
  { id: 'Australia/Sydney', label: '(GMT+10:00) Sydney, Melbourne', city: 'Sydney, Melbourne, Canberra', offset: '+10:00' },
];

export interface TimezoneSelectorProps {
  currentTimezone: string;
  onChangeTimezone: (tz: string) => void;
  className?: string;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  currentTimezone,
  onChangeTimezone,
  className,
}) => {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = TIMEZONES.find((t) => t.id === currentTimezone || t.label.includes(currentTimezone)) || TIMEZONES[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filtered = TIMEZONES.filter(
    (tz) =>
      tz.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tz.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (tz: TimezoneOption) => {
    onChangeTimezone(tz.id);
    setIsOpen(false);
    setSearchQuery('');
    addToast({
      type: 'success',
      title: 'Time Zone Updated',
      description: `Synchronized Nexorbit scheduler with ${tz.label}.`,
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
          Time zone
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Set your local time zone.
        </p>
      </div>

      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full sm:w-[240px] flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="truncate">{selected.label}</span>
          </div>
          <ChevronDown
            className={cn('h-4 w-4 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-full sm:w-[280px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input */}
            <div className="px-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search city or GMT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-hidden w-full text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                  autoFocus
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">No time zones found</div>
              ) : (
                filtered.map((tz) => {
                  const isCurrent = tz.id === selected.id;
                  return (
                    <button
                      key={tz.id}
                      onClick={() => handleSelect(tz)}
                      className={cn(
                        'w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer',
                        isCurrent
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      )}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="truncate font-semibold">{tz.label}</div>
                        <div className="text-[10px] text-slate-400 truncate">{tz.city}</div>
                      </div>
                      {isCurrent && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
