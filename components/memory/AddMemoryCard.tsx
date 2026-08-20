'use client';

import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AddMemoryCardProps {
  onClick: () => void;
}

export const AddMemoryCard: React.FC<AddMemoryCardProps> = ({ onClick }) => {
  return (
    <button
      id="bottom-add-memory-card"
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between p-4 sm:p-4.5 rounded-2xl text-left',
        'bg-[#11131c]/60 hover:bg-[#151824]/90',
        'border border-dashed border-white/[0.1] hover:border-blue-500/40',
        'transition-all duration-200 group'
      )}
    >
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
          <Plus size={18} strokeWidth={2.2} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
            Add to Memory
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Tell Nexorbit something it should remember
          </p>
        </div>
      </div>

      <ChevronRight
        size={18}
        className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all"
      />
    </button>
  );
};
