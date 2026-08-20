'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ConnectedAppsHeaderProps {
  className?: string;
  onConnectNewApp?: () => void;
}

export const ConnectedAppsHeader: React.FC<ConnectedAppsHeaderProps> = ({
  className,
  onConnectNewApp,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80', className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          Connected Apps
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Connect the tools you use so Nexorbit can understand your world.
        </p>
      </div>

      <button
        onClick={onConnectNewApp}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer shrink-0 self-start sm:self-center"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Connect New App</span>
      </button>
    </div>
  );
};

