'use client';

import React from 'react';
import { Calendar as CalendarIcon, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DateSelectorPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRange: string;
  onSelectRange: (range: string) => void;
}

const DATE_OPTIONS = [
  { id: 'today', label: 'Today, May 14' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: '7days', label: 'Past 7 days' },
  { id: '30days', label: 'Past 30 days' },
  { id: 'custom', label: 'Custom range...' },
];

export const DateSelectorPopover: React.FC<DateSelectorPopoverProps> = ({
  isOpen,
  onClose,
  selectedRange,
  onSelectRange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center sm:justify-end sm:pr-10 pt-28">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/10 backdrop-blur-2xs"
        onClick={onClose}
      />

      {/* Popover Box */}
      <div className="relative z-50 w-56 bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-2.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Time Horizon
          </span>
          <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
        </div>

        <div className="py-1 space-y-0.5">
          {DATE_OPTIONS.map((opt) => {
            const isSelected = selectedRange === opt.label;

            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelectRange(opt.label);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left",
                  isSelected
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
