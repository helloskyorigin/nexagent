'use client';

import React from 'react';
import {
  Home,
  Brain,
  History,
  CheckSquare,
  Target,
  Cpu,
  Settings as SettingsIcon,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { GlassSurface } from '../ui/Surfaces';
import { useToast } from '../ui/Toast';

export interface PageMeta {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badgeText: string;
}

export const PAGE_CONFIG: Record<string, PageMeta> = {
  home: {
    id: 'home',
    title: 'Home',
    subtitle: 'Your Nexorbit overview will appear here.',
    icon: <Home className="h-5 w-5 text-indigo-600" />,
    badgeText: 'Workspace Home',
  },
  chat: {
    id: 'chat',
    title: 'Chat',
    subtitle: 'Your universal AI assistant and connected world workspace.',
    icon: <Brain className="h-5 w-5 text-indigo-600" />,
    badgeText: 'AI Workspace',
  },
  missions: {
    id: 'missions',
    title: 'Missions',
    subtitle: 'Track, execute, and monitor real workspace tasks.',
    icon: <Target className="h-5 w-5 text-indigo-600" />,
    badgeText: 'Task Execution',
  },
  'what-changed': {
    id: 'what-changed',
    title: 'What Changed',
    subtitle: 'Your workspace context updates will appear here.',
    icon: <History className="h-5 w-5 text-indigo-600" />,
    badgeText: 'Context Feed',
  },
  history: {
    id: 'history',
    title: 'History',
    subtitle: 'Workspace audit log and real activity timeline.',
    icon: <History className="h-5 w-5 text-indigo-600" />,
    badgeText: 'Audit Logs',
  },
  library: {
    id: 'library',
    title: 'Library',
    subtitle: 'Your saved content, files and resources.',
    icon: <History className="h-5 w-5 text-indigo-600" />,
    badgeText: 'Saved Resources',
  },
  'clean-my-day': {
    id: 'clean-my-day',
    title: 'Clean My Day',
    subtitle: 'Your daily focus and task clearing assistant will appear here.',
    icon: <CheckSquare className="h-5 w-5 text-indigo-600" />,
    badgeText: 'Daily Focus',
  },
  memory: {
    id: 'memory',
    title: 'Memory',
    subtitle: 'Your personal AI context and preference memories will appear here.',
    icon: <Cpu className="h-5 w-5 text-indigo-600" />,
    badgeText: 'Workspace Memory',
  },
  'connected-apps': {
    id: 'connected-apps',
    title: 'Connected Apps',
    subtitle: 'Manage workspace integrations, permissions, and synchronization.',
    icon: <Layers className="h-5 w-5 text-indigo-600" />,
    badgeText: 'Connectors',
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    subtitle: 'Your account and workspace settings will appear here.',
    icon: <SettingsIcon className="h-5 w-5 text-indigo-600" />,
    badgeText: 'Workspace Config',
  },
  support: {
    id: 'support',
    title: 'Support',
    subtitle: 'Help and support resources will appear here.',
    icon: <Sparkles className="h-5 w-5 text-indigo-600" />,
    badgeText: 'Help Center',
  },
};

export interface PlaceholderPageProps {
  pageId: string;
  onNavigate?: (pageId: string) => void;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ pageId, onNavigate }) => {
  const { addToast } = useToast();
  const meta = PAGE_CONFIG[pageId] || PAGE_CONFIG['home'];

  const handleSimulateAction = () => {
    addToast({
      type: 'info',
      title: meta.title,
      description: 'Page view ready. Complete module content will be designed in subsequent steps.',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Section Header */}
      <SectionHeader
        title={meta.title}
        subtitle={meta.subtitle}
        badge={<Badge variant="indigo" size="sm">{meta.badgeText}</Badge>}
      />

      {/* Main Intention Banner Card */}
      <GlassSurface className="p-8 rounded-2xl border border-indigo-100 flex flex-col items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center shrink-0">
          {meta.icon}
        </div>

        <div className="space-y-1 max-w-xl">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">{meta.title} Module</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{meta.subtitle}</p>
        </div>

        <div className="pt-2 flex flex-wrap gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSimulateAction}
            leftIcon={<Sparkles className="h-3.5 w-3.5 text-indigo-600" />}
          >
            Explore {meta.title} Context
          </Button>

          {pageId !== 'ask-my-world' && onNavigate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('ask-my-world')}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Open Ask My World
            </Button>
          )}
        </div>
      </GlassSurface>

      {/* Structural Wireframe Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="Module Status">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Routing State</span>
              <span className="text-slate-900 font-semibold font-mono">/{meta.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Design Tokens</span>
              <span className="text-emerald-600 font-medium">Nexorbit Light Luxury</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">App Shell Status</span>
              <span className="text-indigo-600 font-semibold">Active & Integrated</span>
            </div>
          </div>
        </Card>

        <Card title="Security & Scope Boundary">
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Phase 0 Services & Models intact</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Client-side routing enabled</span>
            </div>
          </div>
        </Card>

        <Card title="Next Steps Preview">
          <p className="text-xs text-slate-500 leading-relaxed">
            Detailed views, context feeds, and AI capabilities for this section will be populated in upcoming Phase 1 steps.
          </p>
        </Card>
      </div>
    </div>
  );
};
