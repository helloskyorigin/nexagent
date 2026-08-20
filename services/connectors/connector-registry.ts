export interface ConnectorConfig {
  id: string;
  name: string;
  category: 'Google Workspace' | 'Workspace Integration' | 'Developer Platform' | 'Productivity';
  description: string;
  humanPermissionSummary: string;
  capabilities: string[];
  brandColor: string;
  scopes: string[];
  uses: string[];
  wonts: string[];
}

export const CONNECTOR_REGISTRY: Record<string, ConnectorConfig> = {
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    category: 'Google Workspace',
    description: 'Emails and conversations that help Nexorbit understand your work and relationships.',
    humanPermissionSummary: 'Read relevant emails when needed.',
    capabilities: ['read', 'search', 'send'],
    brandColor: 'text-red-500 bg-red-50 border-red-100',
    scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    uses: [
      'Email threads and conversations you choose to make available',
      'Sender details and meeting requests',
      'Key timelines and commitment dates',
    ],
    wonts: [
      'Send emails without your explicit confirmation',
      'Delete or modify your inbox messages',
      'Share conversation contents with external services',
    ],
  },
  calendar: {
    id: 'calendar',
    name: 'Google Calendar',
    category: 'Google Workspace',
    description: 'Meetings, schedules and events that provide context for your day.',
    humanPermissionSummary: 'Read calendar events to understand your schedule.',
    capabilities: ['read', 'create', 'update'],
    brandColor: 'text-blue-500 bg-blue-50 border-blue-100',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    uses: [
      'Upcoming meeting agendas and participant lists',
      'Time blocks and scheduling conflicts',
      'Event links and conference details',
    ],
    wonts: [
      'Create or delete calendar events without approval',
      'Invite external participants without your consent',
      'Expose private personal events',
    ],
  },
  drive: {
    id: 'drive',
    name: 'Google Drive',
    category: 'Google Workspace',
    description: 'Documents and files that provide context for your projects.',
    humanPermissionSummary: 'Access files you choose to connect.',
    capabilities: ['read', 'search', 'create'],
    brandColor: 'text-amber-500 bg-amber-50 border-amber-100',
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
    uses: [
      'Documents and file texts you choose to make available',
      'Revision history and project specs',
      'File titles and organization tags',
    ],
    wonts: [
      'Edit or overwrite your document contents',
      'Delete files from your Google Drive',
      'Share drive links externally',
    ],
  },
  notion: {
    id: 'notion',
    name: 'Notion',
    category: 'Workspace Integration',
    description: 'Notes, projects and knowledge from your workspace.',
    humanPermissionSummary: 'Read workspace pages and notes you share.',
    capabilities: ['read', 'create', 'update'],
    brandColor: 'text-slate-700 bg-slate-100 border-slate-200',
    scopes: [],
    uses: [
      'Pages and databases you choose to share',
      'Relevant project tasks and specs',
      'Related notes and workspace documents',
    ],
    wonts: [
      'Change your pages without your approval',
      'Delete database records or pages',
      'Access workspace content outside granted pages',
    ],
  },
  github: {
    id: 'github',
    name: 'GitHub',
    category: 'Developer Platform',
    description: 'Repositories, issues and development activity.',
    humanPermissionSummary: 'Read commit logs, issue titles, and pull requests.',
    capabilities: ['read', 'issues', 'pullRequests'],
    brandColor: 'text-slate-900 bg-slate-100 border-slate-300',
    scopes: ['repo', 'read:user'],
    uses: [
      'Repository discussions, issues, and pull requests',
      'Development progress and release milestones',
      'Code commit summaries and change logs',
    ],
    wonts: [
      'Push code or make commits directly',
      'Modify pull requests or close issues automatically',
      'Expose private repository code',
    ],
  },
};
