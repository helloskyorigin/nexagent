'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)} role="button" tabIndex={0}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 w-48 rounded-2xl bg-[#171717] border border-[#444654] shadow-2xl py-1.5 focus:outline-none animate-fadeIn',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {items.map((item) => (
            <button
              key={item.id}
              disabled={item.disabled}
              onClick={() => {
                if (item.onClick) item.onClick();
                setIsOpen(false);
              }}
              className={cn(
                'w-[calc(100%-0.5rem)] mx-1 text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all duration-150',
                item.danger
                  ? 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-300'
                  : 'text-[#ECECF1] hover:bg-[#212121] hover:text-white',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {item.icon && <span className="text-[#C5C5D2]">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
