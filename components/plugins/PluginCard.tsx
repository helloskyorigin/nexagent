'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreHorizontal, Check, RefreshCw, Shield, Trash2, Power, AlertCircle } from 'lucide-react';
import { PluginItem } from '../../services/integrations/types';
import { getPluginIcon } from './PluginIcons';

interface PluginCardProps {
  plugin: PluginItem;
  onConnect: (plugin: PluginItem) => void;
  onManage: (plugin: PluginItem) => void;
  onDisconnect: (plugin: PluginItem) => void;
  onSync?: (plugin: PluginItem) => void;
  onToggleEnabled?: (plugin: PluginItem, enabled: boolean) => void;
}

export const PluginCard: React.FC<PluginCardProps> = ({
  plugin,
  onConnect,
  onManage,
  onDisconnect,
  onSync,
  onToggleEnabled,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const isConnected = plugin.connectionStatus === 'CONNECTED';
  const isConnecting = plugin.connectionStatus === 'CONNECTING';
  const isWaiting = plugin.connectionStatus === 'NEEDS_REAUTH';
  const isError = plugin.connectionStatus === 'ERROR';

  return (
    <div
      id={`plugin-row-${plugin.id}`}
      className="group relative bg-[#121520]/90 hover:bg-[#151928] border border-white/[0.06] hover:border-white/[0.14] rounded-2xl p-3.5 sm:p-4.5 flex items-center justify-between gap-4 transition-all duration-200 shadow-2xs"
    >
      {/* Left section: Icon + Info */}
      <div
        className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0 cursor-pointer"
        onClick={() => {
          if (isConnected) {
            onManage(plugin);
          } else {
            onConnect(plugin);
          }
        }}
      >
        {/* Plugin Official Icon Container (44px) */}
        <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-[#171b29]/90 border border-white/[0.07] group-hover:border-white/[0.15] flex items-center justify-center flex-shrink-0 p-2 transition-all duration-200 group-hover:brightness-110 shadow-inner">
          {getPluginIcon(plugin.id, 'h-6 w-6 sm:h-7 sm:w-7')}
        </div>

        {/* Name, Category & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm sm:text-[15px] font-semibold text-white tracking-tight group-hover:text-blue-300/90 transition-colors">
              {plugin.name}
            </h3>
            <span className="text-[10px] font-medium text-slate-400/90 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.05]">
              {plugin.category}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal mt-0.5 line-clamp-1 leading-relaxed">
            {plugin.description}
          </p>
        </div>
      </div>

      {/* Right section: Minimal Status & Clean Action */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
        {/* Connected State Indicator */}
        {isConnected && (
          <div
            onClick={() => onManage(plugin)}
            className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-emerald-400/95 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg hover:bg-emerald-500/15 transition-all"
            title="Active & connected"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline text-[11px] font-semibold">Connected</span>
          </div>
        )}

        {/* Needs Attention / Error State Indicator */}
        {(isWaiting || isError) && (
          <div
            onClick={() => onConnect(plugin)}
            className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-amber-400/95 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg hover:bg-amber-500/15 transition-all"
            title={isError ? 'Authentication error — click to reconnect' : 'Needs attention'}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="hidden sm:inline text-[11px] font-semibold">
              {isError ? 'Action required' : 'Waiting'}
            </span>
          </div>
        )}

        {/* Action Button: Minimal "+" for Unconnected / Options for Connected */}
        {isConnected ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="h-8 w-8 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/[0.18] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              title={`Manage ${plugin.name}`}
              aria-label={`Options for ${plugin.name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#161a27] border border-white/[0.1] rounded-xl shadow-2xl z-30 py-1.5 divide-y divide-white/[0.06] animate-fadeIn">
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onManage(plugin);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Shield className="h-3.5 w-3.5 text-slate-400" />
                    <span>Manage permissions</span>
                  </button>

                  {onSync && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onSync(plugin);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                      <span>Sync now</span>
                    </button>
                  )}

                  {onToggleEnabled && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onToggleEnabled(plugin, !plugin.enabled);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-white/[0.06] flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Power className="h-3.5 w-3.5 text-slate-400" />
                      <span>{plugin.enabled ? 'Pause integration' : 'Resume integration'}</span>
                    </button>
                  )}
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDisconnect(plugin);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : isConnecting ? (
          <div
            className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center"
            title="Connecting..."
          >
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          </div>
        ) : isWaiting || isError ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onConnect(plugin);
            }}
            className="h-8 w-8 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-500/50 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
            title={`Reconnect ${plugin.name}`}
            aria-label={`Reconnect ${plugin.name}`}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onConnect(plugin);
            }}
            className="h-8 w-8 rounded-xl bg-white/[0.03] group-hover:bg-blue-600/15 hover:!bg-blue-600 text-slate-400 group-hover:text-blue-400 hover:!text-white border border-white/[0.08] group-hover:border-blue-500/30 hover:!border-blue-500 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs"
            title={`Connect ${plugin.name}`}
            aria-label={`Connect ${plugin.name}`}
          >
            <Plus className="h-4 w-4 stroke-[2.2]" />
          </button>
        )}
      </div>
    </div>
  );
};
