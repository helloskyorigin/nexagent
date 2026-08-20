'use client';

import React from 'react';
import { Mail, Calendar, HardDrive, BookOpen, GitBranch, Youtube, Heart, ExternalLink } from 'lucide-react';
import { ConnectorId } from '../connectors/types';
import { cn } from '../../lib/utils';

export interface GoalSourceIconProps {
  type: ConnectorId | 'health' | 'youtube' | 'custom';
  name?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const GoalSourceIcon: React.FC<GoalSourceIconProps> = ({
  type,
  name,
  className,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick(e);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'gmail':
        return (
          <div
            title={name || 'Gmail'}
            className={cn(
              'h-6 w-6 rounded-md bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 transition-transform hover:scale-110 shadow-2xs cursor-pointer',
              className
            )}
            onClick={handleClick}
          >
            <Mail className="h-3.5 w-3.5" />
          </div>
        );
      case 'calendar':
        return (
          <div
            title={name || 'Google Calendar'}
            className={cn(
              'h-6 w-6 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 transition-transform hover:scale-110 shadow-2xs cursor-pointer',
              className
            )}
            onClick={handleClick}
          >
            <Calendar className="h-3.5 w-3.5" />
          </div>
        );
      case 'drive':
        return (
          <div
            title={name || 'Google Drive'}
            className={cn(
              'h-6 w-6 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 transition-transform hover:scale-110 shadow-2xs cursor-pointer',
              className
            )}
            onClick={handleClick}
          >
            <HardDrive className="h-3.5 w-3.5" />
          </div>
        );
      case 'notion':
        return (
          <div
            title={name || 'Notion'}
            className={cn(
              'h-6 w-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 transition-transform hover:scale-110 shadow-2xs cursor-pointer',
              className
            )}
            onClick={handleClick}
          >
            <BookOpen className="h-3.5 w-3.5" />
          </div>
        );
      case 'github':
        return (
          <div
            title={name || 'GitHub'}
            className={cn(
              'h-6 w-6 rounded-md bg-slate-900 text-white flex items-center justify-center transition-transform hover:scale-110 shadow-2xs cursor-pointer',
              className
            )}
            onClick={handleClick}
          >
            <GitBranch className="h-3.5 w-3.5" />
          </div>
        );
      case 'youtube':
        return (
          <div
            title={name || 'YouTube'}
            className={cn(
              'h-6 w-6 rounded-md bg-red-50 border border-red-100 flex items-center justify-center text-red-600 transition-transform hover:scale-110 shadow-2xs cursor-pointer',
              className
            )}
            onClick={handleClick}
          >
            <Youtube className="h-3.5 w-3.5" />
          </div>
        );
      case 'health':
        return (
          <div
            title={name || 'Apple Health'}
            className={cn(
              'h-6 w-6 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 transition-transform hover:scale-110 shadow-2xs cursor-pointer',
              className
            )}
            onClick={handleClick}
          >
            <Heart className="h-3.5 w-3.5 fill-emerald-600/20" />
          </div>
        );
      default:
        return (
          <div
            title={name || 'External Integration'}
            className={cn(
              'h-6 w-6 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 transition-transform hover:scale-110 shadow-2xs cursor-pointer',
              className
            )}
            onClick={handleClick}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </div>
        );
    }
  };

  return getIcon();
};
