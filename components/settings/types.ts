export type SettingsTabId =
  | 'profile'
  | 'general'
  | 'ai-brain'
  | 'memory-data'
  | 'privacy-security'
  | 'notifications'
  | 'appearance'
  | 'connected-apps'
  | 'advanced';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  nexorbitId: string;
  memberSince: string;
  avatarUrl?: string;
  timezone: string;
  language: string;
  plan: 'Free Plan' | 'Pro Plan' | 'Enterprise Plan';
}

export interface GeneralPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  startupView: 'clean-my-day' | 'home' | 'chat' | 'memory';
}

export interface AIBrainPreferences {
  defaultMode: 'Auto' | 'Nexorbit AI' | 'My Connected World';
  responseStyle: 'Concise' | 'Balanced' | 'Detailed';
  proactiveSuggestions: boolean;
  autoExtractEntities: boolean;
}

export interface PrivacyPreferences {
  zeroTraining: boolean;
  localEncryption: boolean;
  retentionDays: number;
}

export interface NotificationPreferences {
  importantChanges: boolean;
  meetingReminders: boolean;
  aiUpdates: boolean;
}

export interface AppearancePreferences {
  theme: 'light';
  density: 'compact' | 'comfortable';
}
