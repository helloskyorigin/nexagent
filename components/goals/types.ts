import { ConnectorId } from '../connectors/types';

export type GoalCategory = 'All Goals' | 'Work' | 'Personal' | 'Learning' | 'Health';

export type GoalPriority = 'High priority' | 'Medium priority' | 'Low priority';

export type GoalStatus = 'on_track' | 'at_risk' | 'not_started' | 'completed' | 'paused' | 'archived';

export interface ConnectedSource {
  id: string;
  type: ConnectorId | 'health' | 'youtube' | 'custom';
  name: string;
  detail: string;
  snippet?: string;
  time?: string;
  badge?: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  targetDate: string;
  daysRemaining: number;
  isCompleted: boolean;
  status: 'completed' | 'in_progress' | 'upcoming';
  category?: string;
  goalTitle?: string;
}

export interface GoalItem {
  id: string;
  title: string;
  category: 'Work' | 'Personal' | 'Learning' | 'Health';
  description: string;
  progress: number;
  targetDate: string;
  priority: GoalPriority;
  status: GoalStatus;
  iconType: 'rocket' | 'users' | 'brain' | 'heart' | 'book' | 'target' | 'code' | 'zap';
  iconTheme: 'purple' | 'emerald' | 'amber' | 'rose' | 'blue' | 'indigo';
  nextAction: {
    title: string;
    time: string;
    type?: string;
    context?: string;
  };
  connectedSources: ConnectedSource[];
  moreSourcesCount?: number;
  milestones: MilestoneItem[];
  aiReasoning: string;
  blockers?: string[];
  successMetric?: string;
  synapticInsights?: {
    driveFiles?: string[];
    emails?: string[];
    calendarEvents?: string[];
    notionPages?: string[];
  };
  isArchived?: boolean;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  targetGoalId: string;
  impact: string;
  actionLabel: string;
  actionType: 'schedule_focus' | 'delegate' | 'review_pricing' | 'adjust_timeline';
  fullExplanation: string;
}

export interface FilterOptions {
  category: GoalCategory;
  priority: 'all' | 'high' | 'medium' | 'low';
  status: 'all' | 'on_track' | 'at_risk' | 'not_started' | 'completed';
  sortBy: 'recommended' | 'progress_asc' | 'progress_desc' | 'target_date' | 'priority';
}
