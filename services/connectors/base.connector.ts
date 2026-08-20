import { SupportedConnectorType } from '../../config';
import { ConnectorStatus, ConnectorSyncResult } from '../../types/connectors';
import { Connector, ConnectorPermission } from '../../types/models';
import { inMemoryStore } from '../../lib/firebase';
import { UserIsolationService } from '../security/user-isolation.service';
import { getAdminDb } from '../../lib/firebase-admin';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// Encryption helper
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';

export class EncryptionService {
  private static getSecretKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY || process.env.GEMINI_API_KEY || 'default-fallback-32-byte-key-nexorbit';
    return Buffer.alloc(32, key, 'utf8');
  }

  public static encrypt(text: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(ENCRYPTION_ALGORITHM, this.getSecretKey(), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  public static decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, this.getSecretKey(), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

export abstract class BaseConnector {
  abstract readonly type: SupportedConnectorType;

  public getProviderId(): string {
    const map: Record<string, string> = {
      GMAIL: 'gmail',
      GOOGLE_CALENDAR: 'calendar',
      GOOGLE_DRIVE: 'drive',
      NOTION: 'notion',
      GITHUB: 'github'
    };
    return map[this.type] || this.type.toLowerCase();
  }

  protected getConnectorDocId(userId: string): string {
    return `connector_${userId}_${this.type}`;
  }

  // Generate the provider authorization URL
  abstract getOAuthUrl(userId: string, redirectUri: string): string;

  // Real OAuth token exchange
  abstract exchangeCodeForTokens(code: string, redirectUri: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    accountEmail?: string;
    accountName?: string;
    scopes?: string[];
  }>;

  // Real OAuth token refresh
  abstract refreshTokens(refreshToken: string): Promise<{
    accessToken: string;
    expiresIn?: number;
  }>;

  // Connect flow: exchanges authorization code and saves state
  async connectWithCode(userId: string, code: string, redirectUri: string): Promise<Connector> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const provider = this.getProviderId();

    const tokenData = await this.exchangeCodeForTokens(code, redirectUri);
    const now = new Date().toISOString();

    // Encrypt sensitive secrets before persisting
    const encryptedAccessToken = EncryptionService.encrypt(tokenData.accessToken);
    const encryptedRefreshToken = tokenData.refreshToken 
      ? EncryptionService.encrypt(tokenData.refreshToken) 
      : null;

    const db = getAdminDb();

    // 1. Save ENCRYPTED tokens to secure_credentials (server-only collection)
    const credRef = db
      .collection('users')
      .doc(validUserId)
      .collection('secure_credentials')
      .doc(provider);

    await credRef.set({
      provider,
      encryptedAccessToken,
      encryptedRefreshToken,
      expiresAt: tokenData.expiresIn ? new Date(Date.now() + tokenData.expiresIn * 1000).toISOString() : null,
      scopes: tokenData.scopes || [],
      updatedAt: now,
    });

    // 2. Save SAFE metadata to connections (accessible to client)
    const connRef = db
      .collection('users')
      .doc(validUserId)
      .collection('connections')
      .doc(provider);

    const safeMetadata = {
      provider,
      status: 'CONNECTED',
      accountEmail: tokenData.accountEmail || `user@${provider}.com`,
      accountName: tokenData.accountName || 'Connected User',
      scopes: tokenData.scopes || [],
      connectedAt: now,
      updatedAt: now,
      lastHealthCheckAt: now,
    };

    await connRef.set(safeMetadata);

    // Maintain legacy sync structures (inMemoryStore + top level Firestore connectors)
    const legacyDocId = this.getConnectorDocId(validUserId);
    const legacyConnector: Connector = {
      id: legacyDocId,
      userId: validUserId,
      type: this.type,
      status: 'CONNECTED',
      accountEmail: safeMetadata.accountEmail,
      lastSyncedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    inMemoryStore.setDoc('connectors', legacyDocId, legacyConnector as unknown as Record<string, unknown>);
    await db.collection('connectors').doc(legacyDocId).set({
      ...legacyConnector,
      connected: true, // compat flag
    });

    return legacyConnector;
  }

  // Disconnect flow: deletes metadata and secret credentials cleanly
  async disconnect(userId: string): Promise<boolean> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const provider = this.getProviderId();
    const db = getAdminDb();

    // Delete credentials
    await db
      .collection('users')
      .doc(validUserId)
      .collection('secure_credentials')
      .doc(provider)
      .delete();

    // Update connection metadata to NOT_CONNECTED
    await db
      .collection('users')
      .doc(validUserId)
      .collection('connections')
      .doc(provider)
      .delete();

    // Update legacy connectors
    const legacyDocId = this.getConnectorDocId(validUserId);
    inMemoryStore.deleteDoc('connectors', legacyDocId);
    await db.collection('connectors').doc(legacyDocId).delete();

    return true;
  }

  // Status retrieval
  async getStatus(userId: string): Promise<ConnectorStatus> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const provider = this.getProviderId();
    const db = getAdminDb();

    const connDoc = await db
      .collection('users')
      .doc(validUserId)
      .collection('connections')
      .doc(provider)
      .get();

    if (!connDoc.exists) {
      return {
        connected: false,
        type: this.type,
      };
    }

    const data = connDoc.data();
    return {
      connected: data?.status === 'CONNECTED',
      type: this.type,
      accountEmail: data?.accountEmail,
      lastSyncedAt: data?.updatedAt,
      error: data?.status === 'ERROR' ? 'Connection requires re-authentication.' : undefined,
    };
  }

  // Get active scopes
  async getPermissions(userId: string): Promise<ConnectorPermission> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const provider = this.getProviderId();
    const db = getAdminDb();

    const connDoc = await db
      .collection('users')
      .doc(validUserId)
      .collection('connections')
      .doc(provider)
      .get();

    const permDocId = `perm_${validUserId}_${this.type}`;

    if (!connDoc.exists) {
      return {
        id: permDocId,
        userId: validUserId,
        connectorId: this.getConnectorDocId(validUserId),
        connectorType: this.type,
        scopes: [],
        grantedAt: new Date().toISOString(),
      };
    }

    const data = connDoc.data();
    return {
      id: permDocId,
      userId: validUserId,
      connectorId: this.getConnectorDocId(validUserId),
      connectorType: this.type,
      scopes: data?.scopes || [],
      grantedAt: data?.connectedAt || new Date().toISOString(),
    };
  }

  // Health check: evaluates token validity and freshens if possible
  async healthCheck(userId: string): Promise<'Healthy' | 'Needs attention' | 'Disconnected' | 'Error'> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const provider = this.getProviderId();
    const db = getAdminDb();

    const connDoc = await db
      .collection('users')
      .doc(validUserId)
      .collection('connections')
      .doc(provider)
      .get();

    if (!connDoc.exists) {
      return 'Disconnected';
    }

    const credDoc = await db
      .collection('users')
      .doc(validUserId)
      .collection('secure_credentials')
      .doc(provider)
      .get();

    if (!credDoc.exists) {
      return 'Needs attention';
    }

    const credData = credDoc.data();
    const expiresAt = credData?.expiresAt;

    if (expiresAt && new Date(expiresAt) <= new Date()) {
      // Token is expired! Let's try refreshing it
      if (credData?.encryptedRefreshToken) {
        try {
          const refreshToken = EncryptionService.decrypt(credData.encryptedRefreshToken);
          const refreshData = await this.refreshTokens(refreshToken);
          const encryptedAccessToken = EncryptionService.encrypt(refreshData.accessToken);
          
          await db
            .collection('users')
            .doc(validUserId)
            .collection('secure_credentials')
            .doc(provider)
            .update({
              encryptedAccessToken,
              expiresAt: refreshData.expiresIn ? new Date(Date.now() + refreshData.expiresIn * 1000).toISOString() : null,
              updatedAt: new Date().toISOString(),
            });

          await db
            .collection('users')
            .doc(validUserId)
            .collection('connections')
            .doc(provider)
            .update({
              status: 'CONNECTED',
              lastHealthCheckAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

          return 'Healthy';
        } catch (e) {
          console.error(`Token refresh failed for ${this.type}:`, e);
          
          await db
            .collection('users')
            .doc(validUserId)
            .collection('connections')
            .doc(provider)
            .update({
              status: 'RECONNECT_REQUIRED',
              lastHealthCheckAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

          return 'Needs attention';
        }
      } else {
        return 'Needs attention';
      }
    }

    return 'Healthy';
  }

  // Get a valid decrypted access token, automatically refreshing if expired or expiring soon
  async getValidAccessToken(userId: string): Promise<string> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const provider = this.getProviderId();
    const db = getAdminDb();

    const credDoc = await db
      .collection('users')
      .doc(validUserId)
      .collection('secure_credentials')
      .doc(provider)
      .get();

    if (!credDoc.exists) {
      throw new Error(`Connector ${this.type} is not connected. Please connect your account.`);
    }

    const credData = credDoc.data();
    if (!credData || !credData.encryptedAccessToken) {
      throw new Error(`Invalid credentials for ${this.type}. Re-authentication required.`);
    }

    const expiresAt = credData.expiresAt ? new Date(credData.expiresAt).getTime() : null;
    const now = Date.now();

    // If token expires in less than 2 minutes, refresh it automatically
    if (expiresAt && expiresAt - now < 120000) {
      if (credData.encryptedRefreshToken) {
        try {
          const refreshToken = EncryptionService.decrypt(credData.encryptedRefreshToken);
          const refreshData = await this.refreshTokens(refreshToken);
          const newEncryptedAccessToken = EncryptionService.encrypt(refreshData.accessToken);
          const newExpiresAt = refreshData.expiresIn
            ? new Date(Date.now() + refreshData.expiresIn * 1000).toISOString()
            : null;

          await db
            .collection('users')
            .doc(validUserId)
            .collection('secure_credentials')
            .doc(provider)
            .update({
              encryptedAccessToken: newEncryptedAccessToken,
              expiresAt: newExpiresAt,
              updatedAt: new Date().toISOString(),
            });

          await db
            .collection('users')
            .doc(validUserId)
            .collection('connections')
            .doc(provider)
            .update({
              status: 'CONNECTED',
              lastHealthCheckAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

          return refreshData.accessToken;
        } catch (refreshErr) {
          console.error(`Failed to refresh token for ${this.type}:`, refreshErr);
          await db
            .collection('users')
            .doc(validUserId)
            .collection('connections')
            .doc(provider)
            .update({
              status: 'RECONNECT_REQUIRED',
              updatedAt: new Date().toISOString(),
            });
          throw new Error(`Session expired for ${this.type}. Please reconnect your account.`);
        }
      }
    }

    return EncryptionService.decrypt(credData.encryptedAccessToken);
  }

  async sync(userId: string): Promise<ConnectorSyncResult> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const status = await this.getStatus(validUserId);

    if (!status.connected) {
      return {
        connectorType: this.type,
        itemsProcessed: 0,
        status: 'FAILED',
        errors: ['Connector not connected'],
        syncedAt: new Date().toISOString(),
      };
    }

    // Prepare a mock healthy sync output for real connectors
    return {
      connectorType: this.type,
      itemsProcessed: 0,
      status: 'SUCCESS',
      syncedAt: new Date().toISOString(),
    };
  }

  async getData(userId: string): Promise<unknown[]> {
    return [];
  }
}
