export type ConnectorId =
  | 'gmail'
  | 'calendar'
  | 'drive'
  | 'notion'
  | 'github'
  | 'slack'
  | 'outlook'
  | 'onedrive'
  | 'dropbox';

export type SyncState =
  | 'connected'
  | 'connecting'
  | 'syncing'
  | 'up_to_date'
  | 'needs_attention'
  | 'not_connected'
  | 'connection_failed'
  | 'reconnecting'
  | 'error';

export interface ConnectorPermissionItem {
  access: string[];
  use: string[];
  control: string[];
}

export interface ConnectorItem {
  id: ConnectorId;
  name: string;
  category: 'Google Workspace' | 'Workspace Integration' | 'Developer Platform' | 'Productivity';
  description: string;
  humanPermissionSummary: string; // Human-readable permission description
  status: SyncState;
  statusLabel: string;
  lastSynced?: string;
  contextCount?: string;
  contextItems?: string[];
  permissions: ConnectorPermissionItem;
  uses: string[];
  wonts: string[];
  brandColor?: string;
  accountEmail?: string;
}
