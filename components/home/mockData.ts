import {
  UserProfileData,
  StatusSummaryBlock,
  FocusItemData,
  ChangedItemData,
  UpcomingEventData,
} from './types';

export const CURRENT_USER: UserProfileData = {
  name: 'Satyam',
  plan: 'Free Plan',
  email: 'satyam@nexorbit.ai',
  avatarInitial: 'S',
};

export const STATUS_SUMMARY_ITEMS: StatusSummaryBlock[] = [
  {
    id: 'attention',
    count: 2,
    label: 'Need attention',
    iconType: 'attention',
    linkTarget: 'clean-my-day',
  },
  {
    id: 'changed',
    count: 3,
    label: 'Changed',
    iconType: 'changed',
    linkTarget: 'what-changed',
  },
  {
    id: 'upcoming',
    count: 2,
    label: 'Upcoming',
    iconType: 'upcoming',
    linkTarget: 'connectors',
  },
  {
    id: 'completed',
    count: 6,
    label: 'Completed',
    iconType: 'completed',
    linkTarget: 'clean-my-day',
  },
];

export const TODAY_FOCUS_ITEMS: FocusItemData[] = [
  {
    id: 'focus-1',
    title: 'Deadline conflict detected',
    subtitle: 'Friday vs Monday',
    actionText: 'Review',
    iconType: 'conflict',
    actionType: 'review',
    actionQuery: 'Explain the deadline conflict for Project Alpha between Friday and Monday',
  },
  {
    id: 'focus-2',
    title: "Client hasn't replied",
    subtitle: 'Rahul • 4 days',
    actionText: 'Open',
    iconType: 'client',
    actionType: 'open',
    actionQuery: "Show recent communication with Rahul regarding Project Alpha and whether he replied",
  },
  {
    id: 'focus-3',
    title: 'Meeting tomorrow',
    subtitle: '10:00 AM',
    actionText: 'Prepare',
    iconType: 'meeting',
    actionType: 'prepare',
    actionQuery: 'Prepare a briefing document for my 10:00 AM Project Alpha sync meeting tomorrow',
  },
];

export const WHAT_CHANGED_ITEMS: ChangedItemData[] = [
  {
    id: 'change-1',
    title: 'Project Alpha deadline changed',
    subtitle: 'Dec 12 → Dec 15',
    timestamp: '2h ago',
    connector: 'calendar',
  },
  {
    id: 'change-2',
    title: 'Rahul replied',
    subtitle: 'Re: Project Alpha • “Thanks for the update...”',
    timestamp: '4h ago',
    connector: 'gmail',
  },
  {
    id: 'change-3',
    title: 'Proposal v2 updated',
    subtitle: 'In Project Alpha',
    timestamp: '6h ago',
    connector: 'drive',
  },
];

export const UPCOMING_EVENTS: UpcomingEventData[] = [
  {
    id: 'evt-1',
    time: '10:00 AM',
    title: 'Project Alpha Sync',
    locationOrPlatform: 'Google Meet',
    iconType: 'google-meet',
  },
  {
    id: 'evt-2',
    time: '1:30 PM',
    title: 'Client Call',
    locationOrPlatform: 'Zoom Meeting',
    iconType: 'zoom',
  },
  {
    id: 'evt-3',
    time: '4:00 PM',
    title: 'Product Review',
    locationOrPlatform: 'Nexorbit HQ',
    iconType: 'location',
  },
];

export const QUICK_SUGGESTIONS = [
  {
    id: 'sug-1',
    text: 'What changed since yesterday?',
    icon: 'chart',
    query: 'What changed since yesterday across all my connected apps?',
  },
  {
    id: 'sug-2',
    text: 'Do I have any deadline conflicts?',
    icon: 'calendar',
    query: 'Do I have any deadline conflicts across my emails, calendar, and documents?',
  },
  {
    id: 'sug-3',
    text: 'What should I focus on today?',
    icon: 'target',
    query: 'What should I focus on today? Give me an actionable prioritized breakdown.',
  },
];
