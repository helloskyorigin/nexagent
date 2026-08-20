'use client';

export type ChangeImportance = 'important' | 'relevant' | 'informational';

export type CategoryFilter = 
  | 'all' 
  | 'messages' 
  | 'calendar' 
  | 'files';

export type ConnectorSourceId = 
  | 'gmail' 
  | 'calendar' 
  | 'drive' 
  | 'slack' 
  | 'notion' 
  | 'github' 
  | 'asana';

export interface RelatedSourceContext {
  sourceId: ConnectorSourceId;
  sourceName: string;
  title: string;
  snippet?: string;
  timestamp?: string;
}

export interface SubChangeItem {
  id: string;
  title: string;
  contextSnippet: string;
  sourceId: ConnectorSourceId;
  sourceName: string;
  timestamp: string;
  personName?: string;
  personAvatar?: string;
}

export interface ChangeFeedItem {
  id: string;
  title: string;
  contextSubtitle: string;
  sourceId: ConnectorSourceId;
  sourceName: string;
  timeSection: 'Today' | 'Yesterday' | 'Earlier' | 'Earlier Today';
  timestamp: string;
  importance: ChangeImportance; // important = amber/red, relevant = blue/indigo, informational = neutral/green
  category: CategoryFilter;
  isRead: boolean;
  
  // Visual indicators & badges
  iconType: 'mail' | 'calendar' | 'doc' | 'task' | 'mention' | 'code';
  priorityBadge?: string; // e.g., "High Priority"
  personName?: string;
  personAvatar?: string;
  additionalPersonCount?: number;
  badgeDotColor?: 'purple' | 'blue' | 'emerald' | 'amber';

  // AI Interpretation Breakdown & State Transition
  whatChanged: string;
  whyItMatters: string;
  previousValue?: string;
  newValue?: string;
  timeFilterGroup?: 'Today' | 'Yesterday' | 'This Week' | 'This Month';
  relatedContext: RelatedSourceContext[];
  recommendedAction?: {
    label: string;
    actionType: 'review_conflict' | 'prepare_response' | 'open_source' | 'reschedule' | 'view_task';
  };

  // Grouped changes support
  isGroup?: boolean;
  groupProjectName?: string;
  subChanges?: SubChangeItem[];
}

export interface ActiveSourceStat {
  sourceId: ConnectorSourceId;
  sourceName: string;
  count: number;
}

export interface ViewToggleControls {
  connectedApps: boolean;
  yourTeam: boolean; // or myGoals
  mentions: boolean;
  tasksAndProjects: boolean;
}
