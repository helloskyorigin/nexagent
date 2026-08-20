export type AIMode = 'auto' | 'general' | 'connected';

export interface AIModeOption {
  id: AIMode;
  label: string;
  shortLabel: string;
  description: string;
}

export const AI_MODES: AIModeOption[] = [
  {
    id: 'auto',
    label: 'Auto',
    shortLabel: 'Auto',
    description: 'Nexorbit intelligently routes reasoning or connected data',
  },
  {
    id: 'general',
    label: 'Nexorbit AI',
    shortLabel: 'General AI',
    description: 'Normal conversational AI without connector search',
  },
  {
    id: 'connected',
    label: 'My Connected World',
    shortLabel: 'Use my data & apps',
    description: 'Prioritize information from connected apps & files',
  },
];

export type ConnectorType = 'gmail' | 'calendar' | 'drive' | 'notion' | 'github' | 'slack' | 'linear' | 'web';

export interface SourceReference {
  id: string;
  connector: ConnectorType;
  connectorName: string;
  title: string;
  snippet?: string;
  timestamp?: string;
  sender?: string;
  url?: string;
  iconType?: 'drive' | 'gmail' | 'notion' | 'calendar' | 'github' | 'slack' | 'web';
  domain?: string;
}

export interface DocumentCardData {
  title: string;
  source: string;
  updatedAt: string;
  fileType: 'pdf' | 'doc' | 'sheet';
  url?: string;
  size?: string;
}

export interface ChatAction {
  id: string;
  label: string;
  actionType: 'draft_reply' | 'review_conflict' | 'view_meeting' | 'open_source' | 'copy_text' | 'share' | 'add_to_notion' | 'create_task' | 'custom';
  payload?: any;
  icon?: string;
}

export interface FindingItem {
  id: string;
  type: 'conflict' | 'pending' | 'meeting' | 'info';
  title: string;
  timestamp: string;
  description: string;
  sources: SourceReference[];
  actionLabel: string;
  actionType: 'review_conflict' | 'open_conversation' | 'view_meeting' | 'general';
}

export interface MemoryContextData {
  id: string;
  text: string;
  actionText: string;
  relatedCount?: number;
}

export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  file?: File;
  content?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  modeUsed?: AIMode;
  attachments?: ChatAttachment[];
  document?: DocumentCardData;
  highlights?: string[];
  sourcesUsed?: SourceReference[];
  findings?: FindingItem[];
  actions?: ChatAction[];
  memoryContext?: MemoryContextData;
  isThinking?: boolean;
  imageUrl?: string;
  imagePrompt?: string;
  imageStyle?: string;
  imageAspectRatio?: string;
  isImageError?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  updatedAt: string;
  previewText?: string;
  mode: AIMode;
  messages: ChatMessage[];
  sources?: SourceReference[];
  actions?: ChatAction[];
  memory?: MemoryContextData;
}
