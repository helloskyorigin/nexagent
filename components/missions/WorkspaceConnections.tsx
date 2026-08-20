'use client';

import React from 'react';
import { Mail, Calendar, HardDrive, GitBranch, BookOpen, MessageSquare } from 'lucide-react';
import { IntegrationCard } from './IntegrationCard';
import { ServiceIntegrationItem } from './ConnectModal';

export interface WorkspaceConnectionsProps {
  integrations: ServiceIntegrationItem[];
  onConnect: (service: ServiceIntegrationItem) => void;
}

export const INITIAL_INTEGRATIONS: ServiceIntegrationItem[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Email, search and workflow actions',
    icon: Mail,
    status: 'not_connected',
  },
  {
    id: 'drive',
    name: 'Google Drive',
    description: 'Files, documents and folders',
    icon: HardDrive,
    status: 'not_connected',
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    description: 'Meetings and schedule',
    icon: Calendar,
    status: 'not_connected',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Repositories, issues and code',
    icon: GitBranch,
    status: 'not_connected',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Messages, channels and team communication',
    icon: MessageSquare,
    status: 'not_connected',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Pages, databases and workspace content',
    icon: BookOpen,
    status: 'not_connected',
  },
];

export const WorkspaceConnections: React.FC<WorkspaceConnectionsProps> = ({
  integrations,
  onConnect,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Your workspace
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Choose the tools Nexorbit can work with.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {integrations.map((item) => (
          <IntegrationCard key={item.id} item={item} onConnect={onConnect} />
        ))}
      </div>
    </div>
  );
};
