'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useToast } from '../../ui/Toast';
import { cn } from '../../../lib/utils';

export interface LanguageOption {
  id: string;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { id: 'en-US', label: 'English (US)', nativeLabel: 'English (US)', flag: '🇺🇸' },
  { id: 'hi-IN', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { id: 'en-GB', label: 'English (UK)', nativeLabel: 'English (UK)', flag: '🇬🇧' },
  { id: 'es-ES', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  { id: 'fr-FR', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { id: 'de-DE', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
  { id: 'ja-JP', label: 'Japanese', nativeLabel: '日本語', flag: '🇯🇵' },
];

export interface LanguageSettingProps {
  currentLanguage: string;
  onChangeLanguage: (lang: string) => void;
  className?: string;
}

export const LanguageSetting: React.FC<LanguageSettingProps> = ({
  currentLanguage,
  onChangeLanguage,
  className,
}) => {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = LANGUAGES.find((l) => l.id === currentLanguage || l.label === currentLanguage) || LANGUAGES[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (lang: LanguageOption) => {
    onChangeLanguage(lang.id);
    setIsOpen(false);
    addToast({
      type: 'success',
      title: 'Language Updated',
      description: `Interface language set to ${lang.label} (${lang.nativeLabel}).`,
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
          Language
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Choose your preferred language for Nexorbit.
        </p>
      </div>

      {/* Language Custom Dropdown */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full sm:w-[220px] flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Globe className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <span className="truncate">{selected.label}</span>
          </div>
          <ChevronDown
            className={cn('h-4 w-4 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-full sm:w-[240px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
            {LANGUAGES.map((lang) => {
              const isCurrent = lang.id === selected.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => handleSelect(lang)}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer',
                    isCurrent
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({lang.nativeLabel})</span>
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
