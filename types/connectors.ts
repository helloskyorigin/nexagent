import { SupportedConnectorType } from '../config';
import { Connector, ConnectorPermission } from './models';

export interface ConnectorStatus {
  connected: boolean;
  type: SupportedConnectorType;
  accountEmail?: string;
  lastSyncedAt?: string;
  error?: string;
}

export interface ConnectorSyncResult {
  connectorType: SupportedConnectorType;
  itemsProcessed: number;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  errors?: string[];
  syncedAt: string;
}

export interface GenericConnector {
  readonly type: SupportedConnectorType;
  
  connect(userId: string, authData: Record<string, unknown>): Promise<Connector>;
  disconnect(userId: string): Promise<boolean>;
  getStatus(userId: string): Promise<ConnectorStatus>;
  getPermissions(userId: string): Promise<ConnectorPermission>;
  sync(userId: string): Promise<ConnectorSyncResult>;
  getData(userId: string, query?: Record<string, unknown>): Promise<unknown[]>;
  revokeAccess(userId: string): Promise<boolean>;
}
