'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { EnergyLevel } from './types';
import { cn } from '../../lib/utils';

export interface EnergyCheckinCardProps {
  currentEnergy: EnergyLevel;
  onSelectEnergy: (level: EnergyLevel) => void;
}

export const EnergyCheckinCard: React.FC<EnergyCheckinCardProps> = ({
  currentEnergy,
  onSelectEnergy,
}) => {
  const options: { id: EnergyLevel; label: string; emoji: string }[] = [
    { id: 'low', label: 'Low', emoji: '😔' },
    { id: 'okay', label: 'Okay', emoji: '😐' },
    { id: 'good', label: 'Good', emoji: '😊' },
    { id: 'great', label: 'Great', emoji: '😄' },
    { id: 'amazing', label: 'Amazing', emoji: '🔥' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all hover:border-slate-300/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-1.5">
          <span>Energy Checkout</span>
        </h3>
        <Sparkles className="h-4 w-4 text-indigo-500/80" />
      </div>

      <p className="text-xs text-slate-600 mb-3.5">How are you feeling today?</p>

      {/* Emoji Selection Row */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {options.map((option) => {
          const isSelected = currentEnergy === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelectEnergy(option.id)}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer group',
                isSelected
                  ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-slate-50/50 border-slate-200/60 hover:bg-slate-100 hover:border-slate-300'
              )}
            >
              <span className="text-lg sm:text-xl transition-transform group-hover:scale-110">
                {option.emoji}
              </span>
              <span
                className={cn(
                  'text-[10px] sm:text-[11px] font-medium mt-1.5',
                  isSelected ? 'text-indigo-700 font-semibold' : 'text-slate-600'
                )}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
