export type ConnectorType =
  | 'gmail'
  | 'calendar'
  | 'drive'
  | 'notion'
  | 'github'
  | 'slack'
  | 'linear';

export type CommandMode = 'auto' | 'nexorbit-ai' | 'connected-world';

export interface UserProfileData {
  name: string;
  plan: string;
  email?: string;
  avatarInitial: string;
}

export interface StatusSummaryBlock {
  id: string;
  count: number | string;
  label: string;
  iconType: 'attention' | 'changed' | 'upcoming' | 'completed';
  linkTarget: string;
}

export interface FocusItemData {
  id: string;
  title: string;
  subtitle: string;
  actionText: string;
  iconType: 'conflict' | 'client' | 'meeting';
  actionType: 'review' | 'open' | 'prepare';
  actionQuery?: string;
}

export interface ChangedItemData {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  connector: 'calendar' | 'gmail' | 'drive' | 'notion' | 'slack';
}

export interface UpcomingEventData {
  id: string;
  time: string;
  title: string;
  locationOrPlatform: string;
  iconType: 'google-meet' | 'zoom' | 'location' | 'calendar';
}
