'use client';

import {
  MemoryItem,
  CategoryStat,
  ConnectedSourceStat,
  MemorySettingsConfig,
} from './types';

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    title: 'Project Alpha',
    description: 'You are working on Project Alpha — a client proposal platform. Deadline for v2 is May 20, 2024.',
    category: 'Projects',
    tag: 'Project',
    source: {
      type: 'drive',
      name: 'Google Drive',
      fileName: 'Project_Alpha_Overview.docx',
      detail: 'File: Project_Alpha_Overview.docx',
      path: '/Project Alpha/Proposal',
    },
    timestamp: 'May 11, 2024',
    dateGroup: 'Today',
    dotColor: 'blue',
    aboutText: 'You are working on Project Alpha — a client proposal platform. The goal is to deliver a complete v2 to the client by May 20, 2024.',
    keyDetails: [
      { label: 'Deadline', value: 'May 20, 2024' },
      { label: 'Current Phase', value: 'Proposal v2' },
      { label: 'Owner', value: 'You' },
      { label: 'Client', value: 'Alpha Corp' },
      { label: 'Priority', value: 'High' },
    ],
    relatedMemories: [
      { id: 'mem-2', title: 'Rahul (Client)', category: 'People' },
      { id: 'mem-6', title: 'Proposal v2', category: 'Projects' },
      { id: 'mem-4', title: 'Budget Range', category: 'Knowledge' },
    ],
    updatedAt: 'May 11, 2024',
  },
  {
    id: 'mem-2',
    title: 'Rahul (Client)',
    description: 'Rahul is your main contact at Alpha Corp. He prefers short updates and quick responses.',
    category: 'People',
    tag: 'Person',
    source: {
      type: 'gmail',
      name: 'Gmail',
      email: 'rahul@alphacorp.com',
      detail: 'Subject: Re: Project Alpha Scope',
    },
    timestamp: 'May 9, 2024',
    dateGroup: 'Today',
    dotColor: 'purple',
    aboutText: 'Rahul Verma is the lead stakeholder from Alpha Corp overseeing product deliverable acceptance.',
    keyDetails: [
      { label: 'Role', value: 'Main Contact' },
      { label: 'Company', value: 'Alpha Corp' },
      { label: 'Preference', value: 'Short updates & quick responses' },
    ],
    relatedMemories: [
      { id: 'mem-1', title: 'Project Alpha', category: 'Projects' },
      { id: 'mem-3', title: 'Communication Style', category: 'Preferences' },
    ],
    updatedAt: 'May 9, 2024',
  },
  {
    id: 'mem-3',
    title: 'Communication Style',
    description: 'You prefer clear, structured answers with key points and action items.',
    category: 'Preferences',
    tag: 'Preference',
    source: {
      type: 'notion',
      name: 'Notion',
      detail: 'Page: /Team/User_Preferences.md',
    },
    timestamp: 'May 7, 2024',
    dateGroup: 'Yesterday',
    dotColor: 'pink',
    aboutText: 'User prefers bulleted summaries, action items highlighted at top, and concise status communications.',
    keyDetails: [
      { label: 'Format', value: 'Structured bullet points' },
      { label: 'Tone', value: 'Concise & direct' },
      { label: 'Focus', value: 'Action items first' },
    ],
    updatedAt: 'May 7, 2024',
  },
  {
    id: 'mem-4',
    title: 'Budget Range',
    description: 'Project Alpha budget is between $25k - $35k for this phase.',
    category: 'Knowledge',
    tag: 'Knowledge',
    source: {
      type: 'drive',
      name: 'Google Drive',
      fileName: 'Financial_Projections.xlsx',
      detail: 'File: Financial_Projections.xlsx',
    },
    timestamp: 'May 6, 2024',
    dateGroup: 'Yesterday',
    dotColor: 'emerald',
    aboutText: 'Financial allocation for Phase 2 implementation capped between $25,000 and $35,000.',
    keyDetails: [
      { label: 'Min Budget', value: '$25,000' },
      { label: 'Max Budget', value: '$35,000' },
      { label: 'Approved By', value: 'Finance Committee' },
    ],
    relatedMemories: [
      { id: 'mem-1', title: 'Project Alpha', category: 'Projects' },
    ],
    updatedAt: 'May 6, 2024',
  },
  {
    id: 'mem-5',
    title: 'Decision',
    description: 'You decided to prioritize Project Alpha over the Beta integration.',
    category: 'Decisions',
    tag: 'Decision',
    source: {
      type: 'notion',
      name: 'Notion',
      detail: 'Page: Strategy_Decisions_2024.md',
    },
    timestamp: 'Apr 30, 2024',
    dateGroup: 'Earlier this week',
    dotColor: 'amber',
    aboutText: 'Strategic decision made during Q2 roadmap planning to defer Beta integration in favor of completing Project Alpha v2.',
    keyDetails: [
      { label: 'Primary Focus', value: 'Project Alpha' },
      { label: 'Deferred Item', value: 'Beta Integration' },
      { label: 'Rationale', value: 'Client commitment milestone' },
    ],
    relatedMemories: [
      { id: 'mem-1', title: 'Project Alpha', category: 'Projects' },
    ],
    updatedAt: 'Apr 30, 2024',
  },
  {
    id: 'mem-6',
    title: 'Proposal v2',
    description: 'Updated draft proposal with new pricing tiers and SLA terms.',
    category: 'Projects',
    tag: 'Project',
    source: {
      type: 'drive',
      name: 'Google Drive',
      fileName: 'Proposal_v2_Draft.pdf',
    },
    timestamp: 'Apr 28, 2024',
    dateGroup: 'Older',
    dotColor: 'blue',
    aboutText: 'Revised client proposal incorporating enterprise SLA terms and tiered billing.',
    keyDetails: [
      { label: 'Version', value: '2.0' },
      { label: 'Status', value: 'Under Review' },
    ],
    updatedAt: 'Apr 28, 2024',
  },
];

export const CATEGORY_STATS: CategoryStat[] = [
  { category: 'People', count: 32, iconName: 'Users', color: '#6366F1' },
  { category: 'Preferences', count: 21, iconName: 'Sliders', color: '#8B5CF6' },
  { category: 'Projects', count: 18, iconName: 'Folder', color: '#3B82F6' },
  { category: 'Knowledge', count: 57, iconName: 'BookOpen', color: '#10B981' },
  { category: 'Decisions', count: 12, iconName: 'Scale', color: '#F59E0B' },
];

export const CONNECTED_SOURCES_STATS: ConnectedSourceStat[] = [
  { id: 'src-1', name: 'Gmail', type: 'gmail', count: 48, color: '#EA4335' },
  { id: 'src-2', name: 'Google Calendar', type: 'calendar', count: 24, color: '#2684FC' },
  { id: 'src-3', name: 'Google Drive', type: 'drive', count: 32, color: '#00AC47' },
  { id: 'src-4', name: 'Notion', type: 'notion', count: 24, color: '#111827' },
];

export const DEFAULT_MEMORY_SETTINGS: MemorySettingsConfig = {
  autoRememberContext: true,
  rememberConversations: true,
  rememberPreferences: true,
  rememberProjectContext: true,
  allowCrossAppContext: true,
  retentionPeriod: 'forever',
};
