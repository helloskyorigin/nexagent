'use client';

import React from 'react';
import {
  Mail,
  Calendar,
  HardDrive,
  BookOpen,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Info,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export type ConnectorId = 'gmail' | 'calendar' | 'drive' | 'notion' | 'github';

export interface ConnectorInfo {
  id: ConnectorId;
  name: string;
  type: string;
  connected: boolean;
  lastSync?: string;
  permissions: string[];
  description: string;
}

export const CONNECTOR_DATA: Record<ConnectorId, ConnectorInfo> = {
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    type: 'Google Workspace',
    connected: true,
    lastSync: '10 minutes ago',
    description: 'Provides email thread context and communication memory for your personal AI brain.',
    permissions: ['Relevant emails and threads', 'Conversations and sender context', 'Attachments & metadata where permitted'],
  },
  calendar: {
    id: 'calendar',
    name: 'Google Calendar',
    type: 'Google Workspace',
    connected: true,
    lastSync: '5 minutes ago',
    description: 'Syncs schedule, meeting invites, and time availability into your daily context.',
    permissions: ['Calendar event details & times', 'Participant lists', 'Meeting descriptions & links'],
  },
  drive: {
    id: 'drive',
    name: 'Google Drive',
    type: 'Google Workspace',
    connected: true,
    lastSync: '1 hour ago',
    description: 'Indexes documents, sheets, and shared assets for contextual semantic search.',
    permissions: ['Document title & metadata indexing', 'File modification history', 'Permitted document text content'],
  },
  notion: {
    id: 'notion',
    name: 'Notion',
    type: 'Workspace Integration',
    connected: false,
    description: 'Extracts knowledge, project databases, and personal notes into Nexorbit.',
    permissions: ['Page content & database entries', 'Workspace page structure', 'Task status updates'],
  },
  github: {
    id: 'github',
    name: 'GitHub',
    type: 'Developer Platform',
    connected: false,
    description: 'Connects code repositories, pull requests, and issue discussions.',
    permissions: ['Repository issue activity', 'Pull request review updates', 'Commit log context'],
  },
};

export const getConnectorIcon = (id: ConnectorId, className = 'h-5 w-5') => {
  switch (id) {
    case 'gmail':
      return <Mail className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    case 'drive':
      return <HardDrive className={className} />;
    case 'notion':
      return <BookOpen className={className} />;
    case 'github':
      return <GitBranch className={className} />;
    default:
      return <Mail className={className} />;
  }
};

export interface ConnectorModalProps {
  connectorId: ConnectorId | null;
  onClose: () => void;
  onNavigate?: (pageId: string) => void;
}

export const ConnectorModal: React.FC<ConnectorModalProps> = ({ connectorId, onClose, onNavigate }) => {
  const { addToast } = useToast();

  if (!connectorId) return null;
  const connector = CONNECTOR_DATA[connectorId];

  const handleConnectClick = () => {
    onClose();
    if (onNavigate) {
      onNavigate('connected-apps');
    }
  };

  const handleSyncClick = () => {
    onClose();
    if (onNavigate) {
      onNavigate('connected-apps');
    }
  };

  return (
    <Modal
      isOpen={!!connectorId}
      onClose={onClose}
      title={`${connector.name} Connector`}
      description={`${connector.type} Integration`}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>

          {connector.connected ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncClick}
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              >
                Sync Now
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleConnectClick}
              leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
            >
              Connect
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Status Header Header */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-900 shadow-xs">
              {getConnectorIcon(connector.id, 'h-5 w-5 text-indigo-600')}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900">{connector.name}</h4>
              <p className="text-[11px] text-slate-500">{connector.type}</p>
            </div>
          </div>

          <Badge
            variant={connector.connected ? 'success' : 'outline'}
            dot={connector.connected}
            size="sm"
          >
            {connector.connected ? 'Connected' : 'Not connected'}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed">{connector.description}</p>

        {/* Permissions / What Nexorbit Uses */}
        <div className="space-y-2">
          <h5 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
            What Nexorbit Uses
          </h5>
          <div className="rounded-xl bg-white border border-slate-200/80 p-3 space-y-2">
            {connector.permissions.map((perm, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{perm}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Warning / Sync Notice */}
        {connector.connected ? (
          <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200/60 text-emerald-900 text-xs flex items-center justify-between">
            <span className="text-[11px] font-medium">Last active context sync: {connector.lastSync}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Healthy
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-indigo-50/80 border border-indigo-200/60 text-indigo-900 text-xs flex items-start gap-2">
            <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold block">Pending Connector Setup</span>
              <span className="text-[11px] text-indigo-700 block">
                Clicking &quot;Connect&quot; will show setup availability in a future build phase.
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
