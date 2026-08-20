'use client';

import React, { useState } from 'react';
import {
  X,
  Shield,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Lock,
  Layers,
  Power,
  ExternalLink,
} from 'lucide-react';
import { PluginItem } from '../../services/integrations/types';
import { getPluginIcon } from './PluginIcons';
import { PluginStatusBadge } from './PluginStatusBadge';

interface PluginManageDrawerProps {
  isOpen: boolean;
  plugin: PluginItem | null;
  onClose: () => void;
  onDisconnect: (plugin: PluginItem) => void;
  onSync: (plugin: PluginItem) => Promise<void>;
  onToggleEnabled?: (plugin: PluginItem, enabled: boolean) => void;
  onOpenExplorer?: (plugin: PluginItem) => void;
}

export const PluginManageDrawer: React.FC<PluginManageDrawerProps> = ({
  isOpen,
  plugin,
  onClose,
  onDisconnect,
  onSync,
  onToggleEnabled,
  onOpenExplorer,
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !plugin) return null;

  const handleSyncClick = async () => {
    setSyncing(true);
    setSyncSuccessMessage(null);
    try {
      await onSync(plugin);
      setSyncSuccessMessage('Connection active and synchronized');
      setTimeout(() => setSyncSuccessMessage(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const formattedDate = plugin.lastSyncAt
    ? new Date(plugin.lastSyncAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Just now';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#121520] border border-white/[0.1] rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#171b29] border border-white/[0.08] flex items-center justify-center flex-shrink-0 p-2 shadow-inner">
              {getPluginIcon(plugin.id, 'h-6 w-6')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {plugin.name}
                </h2>
                <span className="text-[10px] font-medium text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded-md border border-white/[0.05]">
                  {plugin.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {plugin.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Account Status Card */}
          <div className="bg-[#161a27] border border-white/[0.06] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Connection Status
              </span>
              <PluginStatusBadge status={plugin.connectionStatus} />
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Authorized Account</span>
                <span className="text-xs font-semibold text-white font-mono">
                  {plugin.accountEmail || 'Active Workspace Connection'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Last Synced</span>
                <span className="text-xs text-slate-300">
                  {formattedDate}
                </span>
              </div>
            </div>

            {syncSuccessMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{syncSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* Capabilities Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-400" />
                <span>Available Capabilities</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                {plugin.capabilities.length} active
              </span>
            </div>

            <div className="space-y-2">
              {plugin.capabilities.map((cap) => (
                <div
                  key={cap.id}
                  className="p-3 rounded-xl bg-[#161a27]/80 border border-white/[0.05] flex items-start justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{cap.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                      {cap.description}
                    </p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Scopes Section */}
          {plugin.requiredScopes && plugin.requiredScopes.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-blue-400" />
                <span>Granted Scopes</span>
              </h3>
              <div className="p-3 rounded-xl bg-[#161a27]/80 border border-white/[0.05] space-y-1.5">
                {plugin.requiredScopes.map((scope) => (
                  <div
                    key={scope}
                    className="text-[11px] font-mono text-slate-400 break-all bg-black/40 px-2 py-1 rounded border border-white/[0.06]"
                  >
                    {scope}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDisconnect(plugin);
            }}
            className="px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Disconnect</span>
          </button>

          <div className="flex items-center gap-2">
            {(plugin.id === 'gmail' || plugin.id === 'drive') && (
              <button
                type="button"
                onClick={() => onOpenExplorer?.(plugin)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open {plugin.id === 'gmail' ? 'Inbox' : 'Drive'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSyncClick}
              disabled={syncing}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync now'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
