'use client';

import React from 'react';
import { AlertCircle, History, Calendar, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

export interface SummaryCardsProps {
  onCardClick?: (type: string) => void;
  className?: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ onCardClick, className }) => {
  const cards = [
    {
      id: 'attention',
      count: '2',
      label: 'Need attention',
      icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
      bgIcon: 'bg-amber-50 border-amber-100',
    },
    {
      id: 'changed',
      count: '3',
      label: 'Things changed',
      icon: <History className="h-4 w-4 text-indigo-500" />,
      bgIcon: 'bg-indigo-50 border-indigo-100',
    },
    {
      id: 'upcoming',
      count: '2',
      label: 'Upcoming',
      icon: <Calendar className="h-4 w-4 text-sky-500" />,
      bgIcon: 'bg-sky-50 border-sky-100',
    },
    {
      id: 'completed',
      count: '6',
      label: 'Completed',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
      bgIcon: 'bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-3.5', className)}>
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onCardClick?.(card.id)}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-0.5">
            <div className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              {card.count}
            </div>
            <div className="text-xs font-medium text-slate-500">{card.label}</div>
          </div>
          <div
            className={cn(
              'h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
              card.bgIcon
            )}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};
