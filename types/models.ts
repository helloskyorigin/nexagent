import { PlanType, SupportedConnectorType } from '../config';

// 1. User
export interface User {
  id: string; // Firebase Auth UID
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string;
  preferences: {
    timezone: string;
    language: string;
    notificationsEnabled: boolean;
  };
}

// 2. Subscription
export interface Subscription {
  id: string;
  userId: string;
  plan: PlanType; // FREE | PRO
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'EXPIRED';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

// 3. CreditBalance
export interface CreditBalance {
  userId: string;
  monthlyAllowance: number;
  monthlyRemaining: number;
  addonCredits: number;
  lastResetAt: string;
  updatedAt: string;
}

// 4. CreditUsage
export interface CreditUsage {
  id: string;
  userId: string;
  operation: string;
  cost: number;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// 5. Connector
export interface Connector {
  id: string;
  userId: string;
  type: SupportedConnectorType; // GMAIL, GOOGLE_CALENDAR, GOOGLE_DRIVE, NOTION, GITHUB
  status: 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED' | 'ERROR';
  accountEmail?: string;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 6. ConnectorPermission
export interface ConnectorPermission {
  id: string;
  userId: string;
  connectorId: string;
  connectorType: SupportedConnectorType;
  scopes: string[];
  grantedAt: string;
}

// 7. Memory
export interface Memory {
  id: string;
  userId: string;
  content: string;
  category: 'FACT' | 'PREFERENCE' | 'DECISION' | 'INSIGHT';
  source?: string;
  tags: string[];
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
}

// 8. Goal
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  targetDate?: string;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
}

// 9. Project
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'ARCHIVED';
  relatedConnectorIds: string[];
  createdAt: string;
  updatedAt: string;
}

// 10. Person
export interface Person {
  id: string;
  userId: string;
  name: string;
  email?: string;
  role?: string;
  organization?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 11. Document
export interface Document {
  id: string;
  userId: string;
  title: string;
  mimeType: string;
  connectorType?: SupportedConnectorType;
  externalId?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// 12. Conversation
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  featureContext?: 'ASK_MY_WORLD' | 'CONNECT_THE_DOTS' | 'CLEAN_MY_DAY' | 'GENERAL';
  lastMessageAt: string;
  createdAt: string;
}

// 13. Message
export interface Message {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  evidenceIds?: string[];
  createdAt: string;
}

// 14. ContextItem
export interface ContextItem {
  id: string;
  userId: string;
  sourceType: SupportedConnectorType | 'SYSTEM' | 'USER_MEMORY';
  sourceId: string;
  content: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

// 15. ContextRelationship
export interface ContextRelationship {
  id: string;
  userId: string;
  sourceItemId: string;
  targetItemId: string;
  relationshipType: 'DERIVED_FROM' | 'REFERENCES' | 'CONTRADICTS' | 'CAUSED_BY' | 'PART_OF';
  weight: number;
  createdAt: string;
}

// 16. Task
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  dueDate?: string;
  sourceConnector?: SupportedConnectorType;
  createdAt: string;
  updatedAt: string;
}

// 17. Action
export interface Action {
  id: string;
  userId: string;
  type: string; // e.g. 'SEND_EMAIL', 'CREATE_CALENDAR_EVENT', 'CREATE_NOTION_PAGE'
  targetConnector: SupportedConnectorType;
  payload: Record<string, unknown>;
  status: 'PREPARE' | 'VERIFY' | 'REQUEST_APPROVAL' | 'EXECUTE' | 'VERIFY_RESULT' | 'COMPLETE' | 'FAILED';
  approvalId?: string;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

// 18. ActionApproval
export interface ActionApproval {
  id: string;
  actionId: string;
  userId: string;
  summary: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  decidedAt?: string;
}

// 19. Evidence
export interface Evidence {
  id: string;
  userId: string;
  sourceType: SupportedConnectorType | 'MEMORY' | 'DOCUMENT';
  sourceTitle: string;
  snippet: string;
  url?: string;
  confidenceScore: number;
  timestamp: string;
}

// 20. Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'ACTION_REQUIRED' | 'SUMMARY' | 'WARNING';
  read: boolean;
  createdAt: string;
}

// 21. UsageEvent
export interface UsageEvent {
  id: string;
  userId: string;
  eventType: string;
  durationMs: number;
  creditsConsumed: number;
  timestamp: string;
}
