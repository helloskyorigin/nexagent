'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, ChevronDown, ArrowUp, Check } from 'lucide-react';
import { CommandMode } from './types';
import { cn } from '../../lib/utils';

export interface AICommandSurfaceProps {
  onSubmit: (query: string, mode: CommandMode) => void;
  onAttachClick?: () => void;
  onVoiceClick?: () => void;
  className?: string;
}

const MODE_OPTIONS: { id: CommandMode; label: string; description: string }[] = [
  { id: 'auto', label: 'Auto', description: 'Intelligently chooses between general AI and your connected apps' },
  { id: 'nexorbit-ai', label: 'Nexorbit AI', description: 'General intelligence, writing, research, and analysis' },
  { id: 'connected-world', label: 'My Connected World', description: 'Search and reason across your emails, calendar, and files' },
];

export const AICommandSurface: React.FC<AICommandSurfaceProps> = ({
  onSubmit,
  onAttachClick,
  onVoiceClick,
  className,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState<CommandMode>('auto');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSubmit(inputText.trim(), selectedMode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const selectedModeLabel =
    MODE_OPTIONS.find((m) => m.id === selectedMode)?.label || 'Auto';

  return (
    <div className={cn('relative w-full', className)}>
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-3xl border-2 border-blue-500 shadow-[0_4px_20px_rgba(59,130,246,0.12)] p-4 sm:p-5 transition-all duration-200 focus-within:shadow-[0_6px_28px_rgba(59,130,246,0.2)] focus-within:border-blue-600"
      >
        {/* Main Text Input Area */}
        <div className="min-h-[52px] sm:min-h-[60px] pb-3">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What can Nexorbit help you with?"
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-base sm:text-[17px] font-normal leading-relaxed resize-none focus:outline-none"
          />
        </div>

        {/* Bottom Controls Toolbar */}
        <div className="flex items-center justify-between pt-1 gap-2 border-t border-transparent">
          {/* Left Action Buttons: Attach & Voice */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAttachClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-700 hover:text-slate-950 hover:bg-slate-50 text-[13px] font-medium transition-colors cursor-pointer shadow-3xs"
            >
              <Paperclip className="h-3.5 w-3.5 text-slate-500" />
              <span>Attach</span>
            </button>

            <button
              type="button"
              onClick={onVoiceClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-700 hover:text-slate-950 hover:bg-slate-50 text-[13px] font-medium transition-colors cursor-pointer shadow-3xs"
            >
              <Mic className="h-3.5 w-3.5 text-slate-500" />
              <span>Voice</span>
            </button>
          </div>

          {/* Right Action Buttons: Auto Selector & Send Button */}
          <div className="flex items-center gap-2.5">
            {/* Auto Mode Dropdown Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-700 hover:text-slate-950 hover:bg-slate-50 text-[13px] font-medium transition-colors cursor-pointer shadow-3xs"
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
              >
                <span>{selectedModeLabel}</span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 text-slate-400 transition-transform duration-150',
                    isDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Dropdown Menu Popover */}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 bottom-full mb-2 w-64 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-1.5 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150"
                  role="listbox"
                >
                  {MODE_OPTIONS.map((opt) => {
                    const isSelected = opt.id === selectedMode;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedMode(opt.id);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-blue-50/80 text-blue-900'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                        )}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold">{opt.label}</span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white flex items-center justify-center shadow-sm hover:shadow transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Send query to Nexorbit"
            >
              <ArrowUp className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
