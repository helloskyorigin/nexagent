export type PluginConnectionStatus =
  | 'NOT_CONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'NEEDS_REAUTH'
  | 'ERROR'
  | 'DISABLED'
  | 'UNAVAILABLE';

export type PluginCategory =
  | 'Communication'
  | 'Storage'
  | 'Productivity'
  | 'Developer'
  | 'Analytics'
  | 'Design';

export type ConnectionAuthMethod =
  | 'google_oauth'
  | 'github_oauth'
  | 'slack_oauth'
  | 'notion_oauth'
  | 'api_key';

export interface PluginCapability {
  id: string;
  name: string;
  description: string;
  requiredScope?: string;
  enabledByDefault?: boolean;
}

export interface PluginItem {
  id: string;
  name: string;
  description: string;
  category: PluginCategory;
  provider: string;
  authMethod: ConnectionAuthMethod;
  connectionStatus: PluginConnectionStatus;
  statusLabel?: string;
  capabilities: PluginCapability[];
  accountEmail?: string;
  accountName?: string;
  lastConnectedAt?: string;
  lastSyncAt?: string;
  errorState?: string;
  enabled: boolean;
  popularRank: number;
  requiredScopes: string[];
  grantedScopes?: string[];
  docsUrl?: string;
}

export interface PluginSummaryStats {
  connected: number;
  active: number;
  waiting: number;
  unavailable: number;
  total: number;
}
