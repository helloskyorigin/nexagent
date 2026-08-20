'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, Loader2, ArrowRight, KeyRound, Check } from 'lucide-react';
import { PluginItem } from '../../services/integrations/types';
import { getPluginIcon } from './PluginIcons';

interface PluginConnectModalProps {
  isOpen: boolean;
  plugin: PluginItem | null;
  onClose: () => void;
  onConnectSuccess: () => void;
  onConnectGoogle: (pluginId: string) => Promise<{ success: boolean; error?: string }>;
  onConnectGitHub: () => Promise<{ success: boolean; error?: string }>;
  onConnectDirect: (
    pluginId: string,
    credentials: { accountEmail: string; workspace?: string; token?: string }
  ) => Promise<{ success: boolean; error?: string }>;
}

export const PluginConnectModal: React.FC<PluginConnectModalProps> = ({
  isOpen,
  plugin,
  onClose,
  onConnectSuccess,
  onConnectGoogle,
  onConnectGitHub,
  onConnectDirect,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Direct credentials inputs for Slack / Notion
  const [accountEmail, setAccountEmail] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [apiKey, setApiKey] = useState('');

  if (!isOpen || !plugin) return null;

  const handleOAuthConnect = async () => {
    setConnecting(true);
    setErrorMessage(null);

    try {
      let res: { success: boolean; error?: string };
      if (plugin.provider === 'Google') {
        res = await onConnectGoogle(plugin.id);
      } else if (plugin.provider === 'GitHub') {
        res = await onConnectGitHub();
      } else {
        // Direct
        res = await onConnectDirect(plugin.id, {
          accountEmail: accountEmail || 'user@workspace.com',
          workspace: workspaceName || `${plugin.name} Workspace`,
        });
      }

      if (res.success) {
        onConnectSuccess();
        onClose();
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Connection failed. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountEmail && !workspaceName) {
      setErrorMessage('Please enter an account email or workspace name.');
      return;
    }

    setConnecting(true);
    setErrorMessage(null);

    try {
      const res = await onConnectDirect(plugin.id, {
        accountEmail: accountEmail || `${workspaceName.toLowerCase().replace(/\s+/g, '')}@workspace.com`,
        workspace: workspaceName,
        token: apiKey,
      });

      if (res.success) {
        onConnectSuccess();
        onClose();
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to authenticate connection.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#121520] border border-white/[0.1] rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={connecting}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="h-12 w-12 rounded-2xl bg-[#171b29] border border-white/[0.08] flex items-center justify-center flex-shrink-0 p-2.5 shadow-inner">
            {getPluginIcon(plugin.id, 'h-7 w-7')}
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Connect {plugin.name}
            </h2>
            <p className="text-xs text-slate-400">
              Connect {plugin.name} to let Nexorbit work with your workspace.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Capabilities explanation list */}
        <div className="space-y-2 mb-5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Nexorbit will be able to:
          </span>
          <div className="p-3.5 rounded-xl bg-[#161a27] border border-white/[0.06] space-y-2">
            {plugin.capabilities.map((cap) => (
              <div key={cap.id} className="flex items-start gap-2.5 text-xs text-slate-300">
                <Check className="h-3.5 w-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-white">{cap.name}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                    {cap.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connect Action Flow */}
        {plugin.provider === 'Google' || plugin.provider === 'GitHub' ? (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 text-[11px] text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>
                Standard OAuth 2.0 authorization. Nexorbit accesses only the permitted scopes and performs only approved actions.
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={connecting}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOAuthConnect}
                disabled={connecting}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 active:scale-[0.98]"
              >
                {connecting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Authorizing {plugin.name}...</span>
                  </>
                ) : (
                  <>
                    <span>Connect {plugin.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDirectSubmit} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Workspace / Account Email
              </label>
              <input
                type="text"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-[#161a27] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Workspace Name (Optional)
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder={`${plugin.name} Team`}
                className="w-full bg-[#161a27] border border-white/[0.08] focus:border-blue-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={connecting}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={connecting}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 active:scale-[0.98]"
              >
                {connecting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Authorize {plugin.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
