export type ConnectorType = 'gmail' | 'calendar' | 'drive' | 'notion' | 'github' | 'slack' | 'linear';

export interface SourceItem {
  id: string;
  connector: ConnectorType;
  connectorName: string;
  title: string;
  snippet: string;
  timestamp: string;
  sender?: string;
  url?: string;
}

export interface FindingItem {
  id: string;
  type: 'conflict' | 'pending' | 'meeting' | 'info';
  title: string;
  timestamp: string;
  description: string;
  sources: SourceItem[];
  actionLabel: string;
  actionType: 'review_conflict' | 'open_conversation' | 'view_meeting' | 'general';
}

export interface AskResponseData {
  id: string;
  summaryText: string;
  timestamp?: string;
  findings: FindingItem[];
  recommendedNextStep?: {
    text: string;
    actionLabel: string;
  };
  sources: SourceItem[];
  whyExplanation?: string;
}

export interface AskMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  aiData?: AskResponseData;
}

export interface AskConversation {
  id: string;
  title: string;
  updatedAt: string;
  previewText?: string;
  messages: AskMessage[];
}

export interface ContextEntity {
  id: string;
  title: string;
  type: 'project' | 'person' | 'email' | 'event' | 'doc';
  subtitle: string;
  countText?: string;
  details?: string[];
}

export interface RelatedItem {
  id: string;
  title: string;
  connector: ConnectorType;
  connectorName: string;
}

export interface InsightCardData {
  id: string;
  title: string;
  content: string;
  priority?: 'high' | 'medium' | 'info';
  sources?: SourceItem[];
}
