'use client';

import { PluginItem, PluginSummaryStats, PluginConnectionStatus } from './types';
import { INITIAL_PLUGIN_CATALOG } from './catalog';
import { auth, googleProvider, githubProvider } from '../../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

type IntegrationChangeListener = (plugins: PluginItem[], stats: PluginSummaryStats) => void;

interface StoredConnectionRecord {
  id: string;
  status: PluginConnectionStatus;
  accountEmail?: string;
  accountName?: string;
  grantedScopes?: string[];
  connectedAt?: string;
  lastSyncAt?: string;
  enabled?: boolean;
  errorState?: string;
}

class IntegrationRegistryService {
  private listeners: Set<IntegrationChangeListener> = new Set();
  private cachedPlugins: PluginItem[] = [...INITIAL_PLUGIN_CATALOG];
  private isInitialized: boolean = false;
  private currentUserId: string = 'guest';

  constructor() {
    if (typeof window !== 'undefined') {
      this.initFromStorage();
    }
  }

  public setUserId(userId: string | null) {
    const nextId = userId || 'guest';
    if (this.currentUserId !== nextId) {
      this.currentUserId = nextId;
      this.initFromStorage();
    }
  }

  private getStorageKey(): string {
    return `nexorbit_integrations_state_${this.currentUserId}`;
  }

  private initFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(this.getStorageKey());
      let savedRecords: Record<string, StoredConnectionRecord> = {};

      if (raw) {
        savedRecords = JSON.parse(raw);
      }

      this.cachedPlugins = INITIAL_PLUGIN_CATALOG.map((cat) => {
        const saved = savedRecords[cat.id];
        if (saved) {
          return {
            ...cat,
            connectionStatus: saved.status || 'NOT_CONNECTED',
            accountEmail: saved.accountEmail,
            accountName: saved.accountName,
            grantedScopes: saved.grantedScopes || cat.requiredScopes,
            lastConnectedAt: saved.connectedAt,
            lastSyncAt: saved.lastSyncAt,
            enabled: saved.enabled !== false,
            errorState: saved.errorState,
          };
        }
        return {
          ...cat,
          connectionStatus: 'NOT_CONNECTED',
          accountEmail: undefined,
          accountName: undefined,
          grantedScopes: undefined,
          lastConnectedAt: undefined,
          lastSyncAt: undefined,
          enabled: true,
          errorState: undefined,
        };
      });

      this.isInitialized = true;
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to parse stored integration state:', e);
      this.cachedPlugins = [...INITIAL_PLUGIN_CATALOG];
    }
  }

  private persistState() {
    if (typeof window === 'undefined') return;
    try {
      const records: Record<string, StoredConnectionRecord> = {};
      this.cachedPlugins.forEach((p) => {
        if (p.connectionStatus !== 'NOT_CONNECTED') {
          records[p.id] = {
            id: p.id,
            status: p.connectionStatus,
            accountEmail: p.accountEmail,
            accountName: p.accountName,
            grantedScopes: p.grantedScopes,
            connectedAt: p.lastConnectedAt,
            lastSyncAt: p.lastSyncAt,
            enabled: p.enabled,
            errorState: p.errorState,
          };
        }
      });
      localStorage.setItem(this.getStorageKey(), JSON.stringify(records));
    } catch (e) {
      console.error('Failed to persist integration state:', e);
    }
  }

  private notifyListeners() {
    const stats = this.getSummaryStats();
    const plugins = this.getPlugins();
    this.listeners.forEach((listener) => {
      try {
        listener(plugins, stats);
      } catch (err) {
        console.error('Integration listener error:', err);
      }
    });
  }

  public subscribe(listener: IntegrationChangeListener): () => void {
    this.listeners.add(listener);
    // Trigger immediately with current state
    listener(this.getPlugins(), this.getSummaryStats());

    return () => {
      this.listeners.delete(listener);
    };
  }

  public getPlugins(): PluginItem[] {
    return [...this.cachedPlugins];
  }

  public getPlugin(id: string): PluginItem | undefined {
    return this.cachedPlugins.find((p) => p.id === id);
  }

  public getConnectedPlugins(): PluginItem[] {
    return this.cachedPlugins.filter((p) => p.connectionStatus === 'CONNECTED');
  }

  public getSummaryStats(): PluginSummaryStats {
    let connected = 0;
    let active = 0;
    let waiting = 0;
    let unavailable = 0;

    this.cachedPlugins.forEach((p) => {
      if (p.connectionStatus === 'CONNECTED') {
        connected += 1;
        if (p.enabled) {
          active += 1;
        }
      } else if (p.connectionStatus === 'NEEDS_REAUTH' || p.connectionStatus === 'CONNECTING') {
        waiting += 1;
      } else if (p.connectionStatus === 'UNAVAILABLE') {
        unavailable += 1;
      }
    });

    return {
      connected,
      active,
      waiting,
      unavailable,
      total: this.cachedPlugins.length,
    };
  }

  public async connectGooglePlugin(pluginId: string): Promise<{ success: boolean; error?: string }> {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) {
      return { success: false, error: 'Plugin not found' };
    }

    this.updatePluginStatus(pluginId, 'CONNECTING');

    try {
      // Add scopes to googleProvider
      plugin.requiredScopes.forEach((scope) => {
        googleProvider.addScope(scope);
      });

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const accountEmail = user.email || 'user@google.com';
      const accountName = user.displayName || 'Google Account';
      const now = new Date().toISOString();

      this.cachedPlugins = this.cachedPlugins.map((p) => {
        if (p.id === pluginId) {
          return {
            ...p,
            connectionStatus: 'CONNECTED',
            accountEmail,
            accountName,
            grantedScopes: plugin.requiredScopes,
            lastConnectedAt: now,
            lastSyncAt: now,
            enabled: true,
            errorState: undefined,
          };
        }
        return p;
      });

      this.persistState();
      this.notifyListeners();
      return { success: true };
    } catch (err: any) {
      console.warn(`OAuth sign-in error for ${pluginId}:`, err);
      const isCancelled =
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request';

      this.cachedPlugins = this.cachedPlugins.map((p) => {
        if (p.id === pluginId) {
          return {
            ...p,
            connectionStatus: isCancelled ? 'NOT_CONNECTED' : 'ERROR',
            errorState: isCancelled
              ? undefined
              : err?.message || 'Authentication failed. Please try again.',
          };
        }
        return p;
      });

      this.persistState();
      this.notifyListeners();

      if (isCancelled) {
        return { success: false, error: 'Authentication window was closed.' };
      }
      return {
        success: false,
        error: err?.message || 'Connection failed. Please check popup permissions.',
      };
    }
  }

  public async connectGitHubPlugin(): Promise<{ success: boolean; error?: string }> {
    const pluginId = 'github';
    this.updatePluginStatus(pluginId, 'CONNECTING');

    try {
      githubProvider.addScope('repo');
      githubProvider.addScope('read:user');

      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const accountEmail = user.email || `${user.displayName || 'github-user'}@users.noreply.github.com`;
      const accountName = user.displayName || 'GitHub Developer';
      const now = new Date().toISOString();

      this.cachedPlugins = this.cachedPlugins.map((p) => {
        if (p.id === pluginId) {
          return {
            ...p,
            connectionStatus: 'CONNECTED',
            accountEmail,
            accountName,
            grantedScopes: ['repo', 'read:user'],
            lastConnectedAt: now,
            lastSyncAt: now,
            enabled: true,
            errorState: undefined,
          };
        }
        return p;
      });

      this.persistState();
      this.notifyListeners();
      return { success: true };
    } catch (err: any) {
      console.warn('GitHub Auth error:', err);
      const isCancelled =
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request';

      this.cachedPlugins = this.cachedPlugins.map((p) => {
        if (p.id === pluginId) {
          return {
            ...p,
            connectionStatus: isCancelled ? 'NOT_CONNECTED' : 'ERROR',
            errorState: isCancelled
              ? undefined
              : err?.message || 'GitHub connection failed. Please check permissions.',
          };
        }
        return p;
      });

      this.persistState();
      this.notifyListeners();

      if (isCancelled) {
        return { success: false, error: 'Authentication window was closed.' };
      }
      return {
        success: false,
        error: err?.message || 'GitHub connection failed.',
      };
    }
  }

  public async connectDirectCredentials(
    pluginId: string,
    credentials: { accountEmail: string; accountName?: string; token?: string; workspace?: string }
  ): Promise<{ success: boolean; error?: string }> {
    const plugin = this.getPlugin(pluginId);
    if (!plugin) return { success: false, error: 'Plugin not found' };

    this.updatePluginStatus(pluginId, 'CONNECTING');

    // Simulate authenticating against real API endpoint
    await new Promise((resolve) => setTimeout(resolve, 800));

    const now = new Date().toISOString();

    this.cachedPlugins = this.cachedPlugins.map((p) => {
      if (p.id === pluginId) {
        return {
          ...p,
          connectionStatus: 'CONNECTED',
          accountEmail: credentials.accountEmail,
          accountName: credentials.workspace || credentials.accountName || `${p.name} Workspace`,
          grantedScopes: p.requiredScopes,
          lastConnectedAt: now,
          lastSyncAt: now,
          enabled: true,
          errorState: undefined,
        };
      }
      return p;
    });

    this.persistState();
    this.notifyListeners();
    return { success: true };
  }

  public async disconnectPlugin(pluginId: string): Promise<boolean> {
    this.cachedPlugins = this.cachedPlugins.map((p) => {
      if (p.id === pluginId) {
        return {
          ...p,
          connectionStatus: 'NOT_CONNECTED',
          accountEmail: undefined,
          accountName: undefined,
          grantedScopes: undefined,
          lastConnectedAt: undefined,
          lastSyncAt: undefined,
          errorState: undefined,
          enabled: true,
        };
      }
      return p;
    });

    this.persistState();
    this.notifyListeners();
    return true;
  }

  public async syncPlugin(pluginId: string): Promise<{ success: boolean; lastSyncAt: string }> {
    const now = new Date().toISOString();
    this.cachedPlugins = this.cachedPlugins.map((p) => {
      if (p.id === pluginId) {
        return {
          ...p,
          lastSyncAt: now,
        };
      }
      return p;
    });

    this.persistState();
    this.notifyListeners();
    return { success: true, lastSyncAt: now };
  }

  public togglePluginEnabled(pluginId: string, enabled: boolean) {
    this.cachedPlugins = this.cachedPlugins.map((p) => {
      if (p.id === pluginId) {
        return {
          ...p,
          enabled,
        };
      }
      return p;
    });

    this.persistState();
    this.notifyListeners();
  }

  public updatePluginStatus(pluginId: string, status: PluginConnectionStatus, errorState?: string) {
    this.cachedPlugins = this.cachedPlugins.map((p) => {
      if (p.id === pluginId) {
        return {
          ...p,
          connectionStatus: status,
          errorState: errorState || p.errorState,
        };
      }
      return p;
    });

    this.notifyListeners();
  }
}

export const IntegrationService = new IntegrationRegistryService();
