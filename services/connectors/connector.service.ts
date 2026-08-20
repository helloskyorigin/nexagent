import { SupportedConnectorType, Nexorbit_CONFIG } from '../../config';
import { BaseConnector } from './base.connector';
import { ConnectorStatus, ConnectorSyncResult } from '../../types/connectors';
import { Connector } from '../../types/models';
import { ErrorCode, NexorbitError } from '../../types/errors';
import { getAdminDb } from '../../lib/firebase-admin';

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  fromName: string;
  fromEmail: string;
  to: string;
  date: string;
  timestamp: number;
  snippet: string;
  isUnread: boolean;
  isStarred: boolean;
  isImportant: boolean;
  labelIds: string[];
  hasAttachments: boolean;
  bodySnippet?: string;
  bodyHtml?: string;
  bodyText?: string;
}

export interface GmailProfileData {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

function decodeBase64Url(str: string): string {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

export class GmailConnector extends BaseConnector {
  readonly type: SupportedConnectorType = 'GMAIL';

  getOAuthUrl(userId: string, redirectUri: string): string {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    if (!clientId) {
      throw new Error('GOOGLE_OAUTH_CLIENT_ID is not configured.');
    }

    const state = `${userId}:gmail`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/gmail.readonly',
      access_type: 'offline',
      prompt: 'consent',
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri: string) {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials are not fully configured.');
    }

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Google token exchange failed: ${errorText}`);
    }

    const data = await res.json();
    
    // Fetch profile details securely
    let accountEmail = `user@gmail.com`;
    let accountName = `Google User`;

    try {
      const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        accountEmail = profile.email || accountEmail;
        accountName = profile.name || accountName;
      }
    } catch (e) {
      console.warn('Failed to fetch Google User Info:', e);
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      accountEmail,
      accountName,
      scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    };
  }

  async refreshTokens(refreshToken: string) {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials are not fully configured.');
    }

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Google token refresh failed: ${errorText}`);
    }

    const data = await res.json();
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  }

  // Real Gmail API: Fetch Profile
  async getProfile(userId: string): Promise<GmailProfileData> {
    const accessToken = await this.getValidAccessToken(userId);
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch Gmail profile: ${errText}`);
    }

    return (await res.json()) as GmailProfileData;
  }

  // Real Gmail API: List & Search Messages
  async listMessages(
    userId: string,
    options?: {
      q?: string;
      labelIds?: string[];
      maxResults?: number;
      pageToken?: string;
    }
  ): Promise<{
    messages: GmailMessageSummary[];
    nextPageToken?: string;
    resultSizeEstimate: number;
  }> {
    const accessToken = await this.getValidAccessToken(userId);
    const queryParams = new URLSearchParams();

    if (options?.q) queryParams.set('q', options.q);
    const maxResults = options?.maxResults ? Math.min(options.maxResults, 30) : 15;
    queryParams.set('maxResults', String(maxResults));
    if (options?.pageToken) queryParams.set('pageToken', options.pageToken);
    if (options?.labelIds && options.labelIds.length > 0) {
      options.labelIds.forEach((lbl) => queryParams.append('labelIds', lbl));
    }

    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?${queryParams.toString()}`;
    const res = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to list Gmail messages: ${errText}`);
    }

    const listData = await res.json();
    const messageStubs = (listData.messages || []) as { id: string; threadId: string }[];

    if (messageStubs.length === 0) {
      return {
        messages: [],
        nextPageToken: listData.nextPageToken,
        resultSizeEstimate: listData.resultSizeEstimate || 0,
      };
    }

    // Concurrently fetch message details for the batch
    const detailPromises = messageStubs.map(async (stub) => {
      try {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${stub.id}?format=full`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!detailRes.ok) return null;
        const msg = await detailRes.json();
        return this.parseGmailMessage(msg, false);
      } catch (err) {
        console.warn(`Failed to parse Gmail message ${stub.id}:`, err);
        return null;
      }
    });

    const detailedList = (await Promise.all(detailPromises)).filter(
      (m): m is GmailMessageSummary => m !== null
    );

    return {
      messages: detailedList,
      nextPageToken: listData.nextPageToken,
      resultSizeEstimate: listData.resultSizeEstimate || detailedList.length,
    };
  }

  // Real Gmail API: Read Single Message
  async getMessage(userId: string, messageId: string): Promise<GmailMessageSummary> {
    const accessToken = await this.getValidAccessToken(userId);
    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(messageId)}?format=full`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch message ${messageId}: ${errText}`);
    }

    const rawMsg = await res.json();
    return this.parseGmailMessage(rawMsg, true);
  }

  // Helper: Parse raw Gmail API message structure into clean, safe model
  private parseGmailMessage(raw: any, includeFullBody = false): GmailMessageSummary {
    const headers: { name: string; value: string }[] = raw.payload?.headers || [];
    const getHeader = (name: string) => {
      const found = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
      return found ? found.value : '';
    };

    const subject = getHeader('Subject') || '(No Subject)';
    const fromRaw = getHeader('From') || 'Unknown Sender';
    const to = getHeader('To') || '';
    const dateHeader = getHeader('Date') || '';
    const timestamp = raw.internalDate ? parseInt(raw.internalDate, 10) : Date.now();
    const labelIds: string[] = raw.labelIds || [];

    // Parse sender name & email
    let fromName = fromRaw;
    let fromEmail = fromRaw;
    const match = fromRaw.match(/(.*)<(.+)>/);
    if (match) {
      fromName = match[1].trim().replace(/^["']|["']$/g, '');
      fromEmail = match[2].trim();
    } else if (fromRaw.includes('@')) {
      fromEmail = fromRaw.trim();
      fromName = fromRaw.split('@')[0];
    }

    let bodyText = '';
    let bodyHtml = '';
    let hasAttachments = false;

    // Traverse body parts
    const extractParts = (part: any) => {
      if (!part) return;
      if (part.filename && part.filename.length > 0) {
        hasAttachments = true;
      }
      if (part.mimeType === 'text/plain' && part.body?.data && !bodyText) {
        bodyText = decodeBase64Url(part.body.data);
      } else if (part.mimeType === 'text/html' && part.body?.data && !bodyHtml) {
        bodyHtml = decodeBase64Url(part.body.data);
      }

      if (part.parts && Array.isArray(part.parts)) {
        part.parts.forEach(extractParts);
      }
    };

    if (raw.payload) {
      if (raw.payload.body?.data) {
        if (raw.payload.mimeType === 'text/html') {
          bodyHtml = decodeBase64Url(raw.payload.body.data);
        } else {
          bodyText = decodeBase64Url(raw.payload.body.data);
        }
      }
      if (raw.payload.parts) {
        raw.payload.parts.forEach(extractParts);
      }
    }

    const snippet = raw.snippet ? raw.snippet.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&') : '';

    return {
      id: raw.id,
      threadId: raw.threadId,
      subject,
      from: fromRaw,
      fromName: fromName || fromEmail,
      fromEmail,
      to,
      date: dateHeader || new Date(timestamp).toLocaleDateString(),
      timestamp,
      snippet,
      isUnread: labelIds.includes('UNREAD'),
      isStarred: labelIds.includes('STARRED'),
      isImportant: labelIds.includes('IMPORTANT'),
      labelIds,
      hasAttachments,
      bodyText: includeFullBody ? (bodyText || snippet) : undefined,
      bodyHtml: includeFullBody ? (bodyHtml || undefined) : undefined,
    };
  }
}


export class GoogleCalendarConnector extends BaseConnector {
  readonly type: SupportedConnectorType = 'GOOGLE_CALENDAR';

  getOAuthUrl(userId: string, redirectUri: string): string {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    if (!clientId) {
      throw new Error('GOOGLE_OAUTH_CLIENT_ID is not configured.');
    }

    const state = `${userId}:calendar`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      access_type: 'offline',
      prompt: 'consent',
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri: string) {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials are not fully configured.');
    }

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Google token exchange failed: ${errorText}`);
    }

    const data = await res.json();
    
    let accountEmail = `user@calendar.google.com`;
    let accountName = `Google Calendar User`;

    try {
      const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        accountEmail = profile.email || accountEmail;
        accountName = profile.name || accountName;
      }
    } catch (e) {
      console.warn('Failed to fetch Google User Info:', e);
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      accountEmail,
      accountName,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    };
  }

  async refreshTokens(refreshToken: string) {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials are not fully configured.');
    }

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Google token refresh failed: ${errorText}`);
    }

    const data = await res.json();
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  }
}

export interface DriveFileSummary {
  id: string;
  name: string;
  mimeType: string;
  kind: string;
  webViewLink?: string;
  iconLink?: string;
  modifiedTime?: string;
  size?: string;
  thumbnailLink?: string;
}

export class GoogleDriveConnector extends BaseConnector {
  readonly type: SupportedConnectorType = 'GOOGLE_DRIVE';

  getOAuthUrl(userId: string, redirectUri: string): string {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    if (!clientId) {
      throw new Error('GOOGLE_OAUTH_CLIENT_ID is not configured.');
    }

    const state = `${userId}:drive`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.activity',
        'https://www.googleapis.com/auth/drive.activity.readonly',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.apps.readonly',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.install',
        'https://www.googleapis.com/auth/drive.meet.readonly',
        'https://www.googleapis.com/auth/drive.metadata',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/drive.photos.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.scripts'
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri: string) {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials are not fully configured.');
    }

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Google token exchange failed: ${errorText}`);
    }

    const data = await res.json();
    
    let accountEmail = `user@drive.google.com`;
    let accountName = `Google Drive User`;

    try {
      const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      if (profileRes.ok) {
        const profile = await profileRes.json();
        accountEmail = profile.email || accountEmail;
        accountName = profile.name || accountName;
      }
    } catch (e) {
      console.warn('Failed to fetch Google User Info:', e);
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      accountEmail,
      accountName,
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.activity',
        'https://www.googleapis.com/auth/drive.activity.readonly',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.apps.readonly',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.install',
        'https://www.googleapis.com/auth/drive.meet.readonly',
        'https://www.googleapis.com/auth/drive.metadata',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/drive.photos.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.scripts'
      ],
    };
  }

  async refreshTokens(refreshToken: string) {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials are not fully configured.');
    }

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Google token refresh failed: ${errorText}`);
    }

    const data = await res.json();
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  }

  async listFiles(
    userId: string,
    options?: {
      q?: string;
      pageToken?: string;
      pageSize?: number;
    }
  ): Promise<{
    files: DriveFileSummary[];
    nextPageToken?: string;
  }> {
    const accessToken = await this.getValidAccessToken(userId);
    const queryParams = new URLSearchParams();

    if (options?.q) queryParams.set('q', options.q);
    const pageSize = options?.pageSize ? Math.min(options.pageSize, 100) : 30;
    queryParams.set('pageSize', String(pageSize));
    if (options?.pageToken) queryParams.set('pageToken', options.pageToken);
    queryParams.set('fields', 'nextPageToken, files(id, name, mimeType, kind, webViewLink, iconLink, modifiedTime, size, thumbnailLink)');

    const listUrl = `https://www.googleapis.com/drive/v3/files?${queryParams.toString()}`;
    const res = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to list Google Drive files: ${errText}`);
    }

    const data = await res.json();
    return {
      files: data.files || [],
      nextPageToken: data.nextPageToken,
    };
  }
}

export class NotionConnector extends BaseConnector {
  readonly type: SupportedConnectorType = 'NOTION';

  getOAuthUrl(userId: string, redirectUri: string): string {
    const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
    if (!clientId) {
      throw new Error('NOTION_OAUTH_CLIENT_ID is not configured.');
    }

    const state = `${userId}:notion`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      owner: 'user',
      state,
    });

    return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri: string) {
    const clientId = process.env.NOTION_OAUTH_CLIENT_ID;
    const clientSecret = process.env.NOTION_OAUTH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Notion OAuth credentials are not fully configured.');
    }

    const tokenCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const res = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${tokenCredentials}`,
      },
      body: JSON.stringify({
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Notion token exchange failed: ${errorText}`);
    }

    const data = await res.json();

    return {
      accessToken: data.access_token,
      accountEmail: data.owner?.user?.person?.email || `user@notion.com`,
      accountName: data.workspace_name || data.owner?.user?.name || `Notion Workspace`,
      scopes: ['read', 'create', 'update'],
    };
  }

  async refreshTokens(refreshToken: string) {
    // Notion tokens do not expire by default or don't support refresh token grant.
    return {
      accessToken: refreshToken,
    };
  }
}

export class GitHubConnector extends BaseConnector {
  readonly type: SupportedConnectorType = 'GITHUB';

  getOAuthUrl(userId: string, redirectUri: string): string {
    const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
    if (!clientId) {
      throw new Error('GITHUB_OAUTH_CLIENT_ID is not configured.');
    }

    const state = `${userId}:github`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'repo,read:user',
      state,
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri: string) {
    const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('GitHub OAuth credentials are not fully configured.');
    }

    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`GitHub token exchange failed: ${errorText}`);
    }

    const data = await res.json();

    if (data.error) {
      throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
    }

    // Fetch GitHub User details
    let accountEmail = `user@github.com`;
    let accountName = `GitHub User`;

    try {
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'Nexorbit-Core-Agent',
        },
      });
      if (userRes.ok) {
        const user = await userRes.json();
        accountEmail = user.email || `${user.login}@users.noreply.github.com`;
        accountName = user.name || user.login || accountName;
      }
    } catch (e) {
      console.warn('Failed to fetch GitHub User Profile:', e);
    }

    return {
      accessToken: data.access_token,
      accountEmail,
      accountName,
      scopes: (data.scope as string || 'repo,read:user').split(','),
    };
  }

  async refreshTokens(refreshToken: string) {
    // GitHub App / OAuth Personal tokens do not expire or support refresh token flow identically unless configured for GitHub App.
    return {
      accessToken: refreshToken,
    };
  }
}

export class ConnectorService {
  private readonly connectorsMap: Map<SupportedConnectorType, BaseConnector>;

  constructor() {
    this.connectorsMap = new Map<SupportedConnectorType, BaseConnector>([
      ['GMAIL', new GmailConnector()],
      ['GOOGLE_CALENDAR', new GoogleCalendarConnector()],
      ['GOOGLE_DRIVE', new GoogleDriveConnector()],
      ['NOTION', new NotionConnector()],
      ['GITHUB', new GitHubConnector()],
    ]);
  }

  public getConnector(type: SupportedConnectorType): BaseConnector {
    const connector = this.connectorsMap.get(type);
    if (!connector) {
      throw new NexorbitError(
        ErrorCode.CONNECTOR_ERROR,
        `Unsupported or unknown connector: ${type}`
      );
    }
    return connector;
  }

  public async getStatuses(userId: string): Promise<ConnectorStatus[]> {
    const statuses: ConnectorStatus[] = [];
    for (const type of Nexorbit_CONFIG.connectors) {
      const connector = this.getConnector(type);
      statuses.push(await connector.getStatus(userId));
    }
    return statuses;
  }

  public async connectConnector(
    userId: string,
    type: SupportedConnectorType,
    authData: Record<string, unknown>
  ): Promise<Connector> {
    const connector = this.getConnector(type);
    if ('code' in authData && typeof authData.code === 'string') {
      const redirectUri = (authData.redirectUri as string) || '';
      return connector.connectWithCode(userId, authData.code, redirectUri);
    }

    // Direct mock connection if code is not provided (for fallback compatibility)
    const validUserId = userId;
    const provider = connector.getProviderId();
    const now = new Date().toISOString();
    const db = getAdminDb();

    await db
      .collection('users')
      .doc(validUserId)
      .collection('connections')
      .doc(provider)
      .set({
        provider,
        status: 'CONNECTED',
        accountEmail: (authData.accountEmail as string) || `demo@${provider}.com`,
        accountName: 'Demo User',
        scopes: (authData.scopes as string[]) || ['read'],
        connectedAt: now,
        updatedAt: now,
        lastHealthCheckAt: now,
      });

    const legacyDocId = `connector_${validUserId}_${type}`;
    const legacyConnector: Connector = {
      id: legacyDocId,
      userId: validUserId,
      type,
      status: 'CONNECTED',
      accountEmail: (authData.accountEmail as string) || `demo@${provider}.com`,
      lastSyncedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('connectors').doc(legacyDocId).set({
      ...legacyConnector,
      connected: true,
    });

    return legacyConnector;
  }

  public async disconnectConnector(userId: string, type: SupportedConnectorType): Promise<boolean> {
    return this.getConnector(type).disconnect(userId);
  }

  public async syncConnector(userId: string, type: SupportedConnectorType): Promise<ConnectorSyncResult> {
    return this.getConnector(type).sync(userId);
  }
}
