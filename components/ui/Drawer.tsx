'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { IconButton } from './IconButton';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  children,
  position = 'right',
}) => {
  const subText = subtitle || description;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      <div className={cn('fixed inset-y-0 flex max-w-full', position === 'right' ? 'right-0' : 'left-0')}>
        <div className="w-screen max-w-md bg-[#15181D] border-l border-slate-800 shadow-2xl flex flex-col z-10 animate-slideLeft">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4 safe-pt">
            <div>
              {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
              {subText && <p className="text-xs text-slate-400 mt-0.5">{subText}</p>}
            </div>
            <IconButton
              icon={<X className="h-4 w-4" />}
              aria-label="Close drawer"
              variant="ghost"
              size="sm"
              onClick={onClose}
            />
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-5 overflow-y-auto safe-pb text-slate-200">{children}</div>
        </div>
      </div>
    </div>
  );
};
