'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Compass, RefreshCw } from 'lucide-react';
import { PluginItem, PluginSummaryStats } from '../../services/integrations/types';
import { IntegrationService } from '../../services/integrations/integration.service';
import { useAuth } from '../auth/AuthContext';
import { PluginSummary } from './PluginSummary';
import { PluginFilters, PluginFilterTab } from './PluginFilters';
import { PluginList } from './PluginList';
import { SecurityCard } from './SecurityCard';
import { SecurityModal } from './SecurityModal';
import { PluginConnectModal } from './PluginConnectModal';
import { PluginManageDrawer } from './PluginManageDrawer';
import { DisconnectConfirmationModal } from './DisconnectConfirmationModal';
import { ExplorePluginsModal } from './ExplorePluginsModal';
import { GmailInboxViewer } from '../connectors/GmailInboxViewer';
import { DriveViewer } from '../connectors/DriveViewer';

export const PluginsPage: React.FC = () => {
  const { user } = useAuth();
  const [plugins, setPlugins] = useState<PluginItem[]>([]);
  const [stats, setStats] = useState<PluginSummaryStats>({
    connected: 0,
    active: 0,
    waiting: 0,
    unavailable: 0,
    total: 0,
  });

  const [currentTab, setCurrentTab] = useState<PluginFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedPluginForConnect, setSelectedPluginForConnect] = useState<PluginItem | null>(null);
  const [selectedPluginForManage, setSelectedPluginForManage] = useState<PluginItem | null>(null);
  const [selectedPluginForDisconnect, setSelectedPluginForDisconnect] = useState<PluginItem | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [isGmailExplorerOpen, setIsGmailExplorerOpen] = useState(false);
  const [isDriveExplorerOpen, setIsDriveExplorerOpen] = useState(false);

  // Sync user context with IntegrationService
  useEffect(() => {
    IntegrationService.setUserId(user?.uid || null);
  }, [user?.uid]);

  // Subscribe to real-time integration state
  useEffect(() => {
    const unsubscribe = IntegrationService.subscribe((updatedPlugins, updatedStats) => {
      setPlugins(updatedPlugins);
      setStats(updatedStats);
    });

    return () => unsubscribe();
  }, []);

  // Compute counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: plugins.length,
      connected: plugins.filter((p) => p.connectionStatus === 'CONNECTED').length,
      waiting: plugins.filter((p) => p.connectionStatus === 'NEEDS_REAUTH' || p.connectionStatus === 'CONNECTING').length,
      popular: plugins.filter((p) => p.popularRank <= 3).length,
    };
  }, [plugins]);

  // Filter and search logic
  const filteredPlugins = useMemo(() => {
    return plugins.filter((plugin) => {
      // Search term filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = plugin.name.toLowerCase().includes(query);
        const matchesDesc = plugin.description.toLowerCase().includes(query);
        const matchesCategory = plugin.category.toLowerCase().includes(query);
        const matchesCapabilities = plugin.capabilities.some((c) =>
          c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesCapabilities) {
          return false;
        }
      }

      // Tab filter
      if (currentTab === 'connected') {
        return plugin.connectionStatus === 'CONNECTED';
      }
      if (currentTab === 'waiting') {
        return plugin.connectionStatus === 'NEEDS_REAUTH' || plugin.connectionStatus === 'CONNECTING';
      }
      if (currentTab === 'popular') {
        return plugin.popularRank <= 3;
      }

      return true;
    });
  }, [plugins, currentTab, searchQuery]);

  // Actions
  const handleOpenConnect = (plugin: PluginItem) => {
    setSelectedPluginForConnect(plugin);
  };

  const handleOpenManage = (plugin: PluginItem) => {
    setSelectedPluginForManage(plugin);
  };

  const handleOpenDisconnect = (plugin: PluginItem) => {
    setSelectedPluginForDisconnect(plugin);
  };

  const handleConfirmDisconnect = async () => {
    if (!selectedPluginForDisconnect) return;
    setIsDisconnecting(true);
    try {
      await IntegrationService.disconnectPlugin(selectedPluginForDisconnect.id);
      setSelectedPluginForDisconnect(null);
      if (selectedPluginForManage?.id === selectedPluginForDisconnect.id) {
        setSelectedPluginForManage(null);
      }
    } catch (e) {
      console.error('Failed to disconnect plugin:', e);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSyncPlugin = async (plugin: PluginItem) => {
    await IntegrationService.syncPlugin(plugin.id);
  };

  const handleToggleEnabled = (plugin: PluginItem, enabled: boolean) => {
    IntegrationService.togglePluginEnabled(plugin.id, enabled);
  };

  const handleOpenExplorer = (plugin: PluginItem) => {
    if (plugin.id === 'gmail') {
      setIsGmailExplorerOpen(true);
      setSelectedPluginForManage(null);
    } else if (plugin.id === 'drive') {
      setIsDriveExplorerOpen(true);
      setSelectedPluginForManage(null);
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-7 animate-fadeIn pb-16">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Plugins
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
            Connect tools and services. Nexorbit will use them to get things done.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExploreModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#15181D] hover:bg-[#1f2433] text-slate-200 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Compass className="h-4 w-4 text-blue-400" />
          <span>Explore Plugins</span>
        </button>
      </div>

      {/* SUMMARY CARD */}
      <PluginSummary stats={stats} />

      {/* FILTERS & SEARCH */}
      <PluginFilters
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={tabCounts}
      />

      {/* PLUGIN LIST */}
      <PluginList
        plugins={filteredPlugins}
        onConnect={handleOpenConnect}
        onManage={handleOpenManage}
        onDisconnect={handleOpenDisconnect}
        onSync={handleSyncPlugin}
        onToggleEnabled={handleToggleEnabled}
        onResetFilters={() => {
          setCurrentTab('all');
          setSearchQuery('');
        }}
      />

      {/* BOTTOM SECURITY CARD */}
      <SecurityCard onLearnMore={() => setIsSecurityModalOpen(true)} />

      {/* MODALS */}
      <PluginConnectModal
        isOpen={!!selectedPluginForConnect}
        plugin={selectedPluginForConnect}
        onClose={() => setSelectedPluginForConnect(null)}
        onConnectSuccess={() => setSelectedPluginForConnect(null)}
        onConnectGoogle={(pluginId) => IntegrationService.connectGooglePlugin(pluginId)}
        onConnectGitHub={() => IntegrationService.connectGitHubPlugin()}
        onConnectDirect={(pluginId, creds) =>
          IntegrationService.connectDirectCredentials(pluginId, creds)
        }
      />

      <PluginManageDrawer
        isOpen={!!selectedPluginForManage}
        plugin={selectedPluginForManage}
        onClose={() => setSelectedPluginForManage(null)}
        onDisconnect={handleOpenDisconnect}
        onSync={handleSyncPlugin}
        onToggleEnabled={handleToggleEnabled}
        onOpenExplorer={handleOpenExplorer}
      />

      <DisconnectConfirmationModal
        isOpen={!!selectedPluginForDisconnect}
        plugin={selectedPluginForDisconnect}
        onConfirm={handleConfirmDisconnect}
        onCancel={() => setSelectedPluginForDisconnect(null)}
        isProcessing={isDisconnecting}
      />

      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />

      <ExplorePluginsModal
        isOpen={isExploreModalOpen}
        onClose={() => setIsExploreModalOpen(false)}
      />

      <GmailInboxViewer
        isOpen={isGmailExplorerOpen}
        onClose={() => setIsGmailExplorerOpen(false)}
        accountEmail={plugins.find(p => p.id === 'gmail')?.accountEmail}
        onRequestDisconnect={() => {
          const gmailPlugin = plugins.find(p => p.id === 'gmail');
          if (gmailPlugin) handleOpenDisconnect(gmailPlugin);
        }}
      />

      <DriveViewer
        isOpen={isDriveExplorerOpen}
        onClose={() => setIsDriveExplorerOpen(false)}
        accountEmail={plugins.find(p => p.id === 'drive')?.accountEmail}
        onRequestDisconnect={() => {
          const drivePlugin = plugins.find(p => p.id === 'drive');
          if (drivePlugin) handleOpenDisconnect(drivePlugin);
        }}
      />
    </div>
  );
};
