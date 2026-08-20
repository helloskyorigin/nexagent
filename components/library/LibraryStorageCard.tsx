'use client';

import React from 'react';
import { HardDrive, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LibraryStorageCardProps {
  storage: {
    usedBytes: number;
    formattedUsed: string;
    maxBytes: number;
    percentage: number;
  };
  onManageClick?: () => void;
}

export const LibraryStorageCard: React.FC<LibraryStorageCardProps> = ({
  storage,
  onManageClick,
}) => {
  return (
    <div
      id="library-storage-card"
      className={cn(
        'p-5 rounded-2xl space-y-4',
        'bg-[#11131c]/90 border border-white/[0.07]',
        'shadow-xs'
      )}
    >
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white tracking-tight">Library Storage</h3>
        <HardDrive size={16} className="text-slate-500" />
      </div>

      {/* Used numbers */}
      <div>
        <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Used</div>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-xl font-bold text-white tracking-tight">
            {storage.formattedUsed}
          </span>
          <span className="text-xs text-slate-400 font-medium">of 1 GB</span>
        </div>
      </div>

      {/* Real Progress Bar */}
      <div>
        <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${Math.max(2, storage.percentage)}%` }}
          />
        </div>
        <div className="text-[11px] text-slate-400 mt-1.5 font-medium">
          {storage.percentage}% Used
        </div>
      </div>

      {/* Manage Action */}
      {onManageClick && (
        <button
          type="button"
          onClick={onManageClick}
          className={cn(
            'w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium',
            'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white',
            'border border-white/[0.08] transition-colors'
          )}
        >
          <span>Manage Storage</span>
          <ArrowUpRight size={13} className="text-slate-400" />
        </button>
      )}
    </div>
  );
};
