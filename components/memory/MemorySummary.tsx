'use client';

import React from 'react';
import { Database } from 'lucide-react';

export interface MemorySummaryProps {
  totalCount?: number;
  filteredCount?: number;
}

export const MemorySummary: React.FC<MemorySummaryProps> = ({
  totalCount = 6,
  filteredCount = 6,
}) => {
  return (
    <div className="flex items-center justify-between px-1 py-1 text-xs text-slate-500 font-medium">
      <div className="flex items-center gap-1.5">
        <Database className="h-3.5 w-3.5 text-slate-400" />
        <span>
          Showing {filteredCount} {filteredCount === 1 ? 'memory' : 'memories'}
          {totalCount !== filteredCount ? ` (filtered from ${totalCount})` : ''} across connected apps
        </span>
      </div>
    </div>
  );
};

