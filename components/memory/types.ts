'use client';

export type MemoryCategory = 'People' | 'Preferences' | 'Projects' | 'Knowledge' | 'Decisions';

export type MemorySourceType =
  | 'gmail'
  | 'calendar'
  | 'notion'
  | 'drive'
  | 'github'
  | 'meet'
  | 'slack'
  | 'manual';

export interface MemorySourceInfo {
  type: MemorySourceType;
  name: string;
  detail?: string;
  email?: string;
  url?: string;
  path?: string;
  fileName?: string;
}

export interface KeyDetailItem {
  label: string;
  value: string;
}

export interface RelatedMemoryRef {
  id: string;
  title: string;
  category?: MemoryCategory;
  time?: string;
  source?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  category: MemoryCategory;
  source: MemorySourceInfo;
  tag: string;
  timestamp: string; // e.g., "May 11, 2024"
  dateGroup?: 'Today' | 'Yesterday' | 'Earlier this week' | 'Older';
  dotColor?: 'blue' | 'green' | 'purple' | 'amber' | 'emerald' | 'pink';
  aboutText?: string;
  keyDetails?: KeyDetailItem[];
  relatedMemories?: RelatedMemoryRef[];
  relatedPerson?: string;
  relatedPersonRole?: string;
  relatedProject?: string;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConnectedSourceStat {
  id: string;
  name: string;
  type: MemorySourceType;
  count: number;
  color: string;
}

export interface CategoryStat {
  category: MemoryCategory;
  count: number;
  iconName: string;
  color: string;
}

export interface MemorySettingsConfig {
  autoRememberContext: boolean;
  rememberConversations: boolean;
  rememberPreferences: boolean;
  rememberProjectContext: boolean;
  allowCrossAppContext: boolean;
  retentionPeriod: 'forever' | '1year' | '6months' | '90days';
}
