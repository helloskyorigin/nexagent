'use client';

import React from 'react';
import { PluginItem } from '../../services/integrations/types';
import { PluginCard } from './PluginCard';
import { SearchX } from 'lucide-react';

interface PluginListProps {
  plugins: PluginItem[];
  onConnect: (plugin: PluginItem) => void;
  onManage: (plugin: PluginItem) => void;
  onDisconnect: (plugin: PluginItem) => void;
  onSync?: (plugin: PluginItem) => void;
  onToggleEnabled?: (plugin: PluginItem, enabled: boolean) => void;
  onResetFilters?: () => void;
}

export const PluginList: React.FC<PluginListProps> = ({
  plugins,
  onConnect,
  onManage,
  onDisconnect,
  onSync,
  onToggleEnabled,
  onResetFilters,
}) => {
  if (plugins.length === 0) {
    return (
      <div className="bg-[#121520] border border-slate-800/80 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center">
        <div className="h-12 w-12 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-center text-slate-500 mb-3">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-white mb-1">
          No plugins match your filter
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-4">
          Try searching with different keywords or switch to the All Plugins tab.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-3.5">
      {plugins.map((plugin) => (
        <PluginCard
          key={plugin.id}
          plugin={plugin}
          onConnect={onConnect}
          onManage={onManage}
          onDisconnect={onDisconnect}
          onSync={onSync}
          onToggleEnabled={onToggleEnabled}
        />
      ))}
    </div>
  );
};
