import { ConnectorId } from '../connectors/types';

export type PriorityLevel = 'high' | 'medium' | 'low';

export type PlanItemType = 'meeting' | 'task' | 'document' | 'break' | 'notes' | 'email';

export interface DailyPlanItem {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  priority: PriorityLevel;
  source: string;
  sourceIcon: 'calendar' | 'gmail' | 'meet' | 'drive' | 'notion' | 'email' | 'task';
  sourceId?: ConnectorId;
  isCompleted: boolean;
  actionLabel?: string;
  actionType?: 'join_meeting' | 'open_email' | 'open_file' | 'take_break' | 'open_notes' | 'send_email' | 'review_task' | 'open_source';
  whyPrioritized?: string;
  previousValue?: string;
  newValue?: string;
  contextEvidence?: {
    source: string;
    snippet: string;
    timestamp: string;
  }[];
}

export type CleanMyDayTab = 'plan' | 'schedule' | 'tasks' | 'focus';

export type EnergyLevel = 'low' | 'okay' | 'good' | 'great' | 'amazing';

export interface PrioritySettings {
  deadlineSensitive: boolean;
  meetingsAndCollab: boolean;
  clientWork: boolean;
  deepWorkBias: boolean;
  quickWins: boolean;
}

