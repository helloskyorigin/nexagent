'use client';

import React from 'react';
import {
  FileText,
  Mail,
  Globe,
  Calendar,
  Folder,
  Code2,
  Bot,
  CheckSquare,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { TaskIconType, TaskSource } from '../../services/tasks/taskService';

interface TaskIconProps {
  iconType?: TaskIconType;
  source?: TaskSource;
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TaskIcon: React.FC<TaskIconProps> = ({
  iconType = 'document',
  source,
  title = '',
  className = '',
  size = 'md',
}) => {
  // Determine icon and color scheme based on iconType or title
  let IconComponent: LucideIcon = FileText;
  let bgClass = 'bg-blue-500/10 border-blue-500/20 text-blue-400';

  const t = title.toLowerCase();

  if (iconType === 'mail' || t.includes('email') || t.includes('mail') || t.includes('inbox')) {
    IconComponent = Mail;
    bgClass = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
  } else if (iconType === 'globe' || t.includes('competitor') || t.includes('web') || t.includes('site') || t.includes('analysis')) {
    IconComponent = Globe;
    bgClass = 'bg-purple-500/10 border-purple-500/20 text-purple-400';
  } else if (iconType === 'calendar' || t.includes('meeting') || t.includes('calendar') || t.includes('schedule') || source === 'scheduled') {
    IconComponent = Calendar;
    bgClass = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
  } else if (iconType === 'folder' || t.includes('drive') || t.includes('document') || t.includes('file') || t.includes('folder')) {
    IconComponent = Folder;
    bgClass = 'bg-slate-500/15 border-slate-500/25 text-slate-300';
  } else if (iconType === 'code' || t.includes('code') || t.includes('github') || t.includes('pr')) {
    IconComponent = Code2;
    bgClass = 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
  } else if (iconType === 'bot' || source === 'agent') {
    IconComponent = FileText;
    bgClass = 'bg-blue-500/10 border-blue-500/20 text-blue-400';
  } else {
    IconComponent = FileText;
    bgClass = 'bg-blue-500/10 border-blue-500/20 text-blue-400';
  }

  const sizeClasses = {
    sm: 'h-8 w-8 rounded-lg',
    md: 'h-10 w-10 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl',
    lg: 'h-12 w-12 rounded-2xl',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5 sm:h-5.5 sm:w-5.5',
    lg: 'h-6 w-6',
  };

  return (
    <div
      className={`flex items-center justify-center border shrink-0 transition-transform shadow-inner ${sizeClasses[size]} ${bgClass} ${className}`}
    >
      <IconComponent className={`${iconSizes[size]} stroke-[1.8]`} />
    </div>
  );
};
