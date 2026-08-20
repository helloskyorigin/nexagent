import { DailyPlanItem, PrioritySettings } from './types';

export const INITIAL_TODAY_PLAN_ITEMS: DailyPlanItem[] = [
  {
    id: 'cmd-1',
    time: '9:00 AM',
    title: 'Deadline conflict: Review changes',
    subtitle: 'Friday vs Monday',
    priority: 'high',
    source: 'Google Calendar',
    sourceIcon: 'calendar',
    sourceId: 'calendar',
    isCompleted: false,
    actionLabel: 'Open Google Calendar',
    actionType: 'join_meeting',
    whyPrioritized: 'Conflict detected between Friday release milestone and Monday client review.',
    previousValue: 'Friday, May 17',
    newValue: 'Monday, May 20',
    contextEvidence: [
      {
        source: 'Google Calendar',
        snippet: 'Project Alpha Review - Conflict with Friday deployment window',
        timestamp: '09:00 AM',
      },
    ],
  },
  {
    id: 'cmd-2',
    time: '10:00 AM',
    title: "Rahul hasn't replied",
    subtitle: 'Follow up on proposal feedback',
    priority: 'high',
    source: 'Gmail',
    sourceIcon: 'gmail',
    sourceId: 'gmail',
    isCompleted: false,
    actionLabel: 'Follow up in Gmail',
    actionType: 'send_email',
    whyPrioritized: 'Critical commercial terms pending Rahul\'s signoff since yesterday 4:00 PM.',
    previousValue: 'Awaiting reply',
    newValue: 'Follow-up recommended',
    contextEvidence: [
      {
        source: 'Gmail',
        snippet: 'Re: Project Alpha Proposal - No response received in 18 hours',
        timestamp: '10:00 AM',
      },
    ],
  },
  {
    id: 'cmd-3',
    time: '1:30 PM',
    title: 'Project Alpha Sync',
    subtitle: 'Google Meet',
    priority: 'medium',
    source: 'Google Meet',
    sourceIcon: 'meet',
    sourceId: 'calendar',
    isCompleted: false,
    actionLabel: 'Join Meet',
    actionType: 'join_meeting',
    whyPrioritized: 'Scheduled team status call with 4 team members.',
    contextEvidence: [
      {
        source: 'Google Meet',
        snippet: 'Project Alpha Weekly Standup • meet.google.com/xyz-alpha',
        timestamp: '1:30 PM',
      },
    ],
  },
  {
    id: 'cmd-4',
    time: '4:00 PM',
    title: 'Review proposal v2',
    subtitle: 'Project Alpha',
    priority: 'medium',
    source: 'Google Drive',
    sourceIcon: 'drive',
    sourceId: 'drive',
    isCompleted: false,
    actionLabel: 'Open Drive File',
    actionType: 'open_file',
    whyPrioritized: 'Document updated by Sarah with new pricing tier breakdown.',
    contextEvidence: [
      {
        source: 'Google Drive',
        snippet: 'Project Alpha Proposal v2.3.pdf updated',
        timestamp: '4:00 PM',
      },
    ],
  },
  {
    id: 'cmd-5',
    time: '6:00 PM',
    title: 'Organize Drive files',
    subtitle: 'Project Alpha folder',
    priority: 'low',
    source: 'Google Drive',
    sourceIcon: 'drive',
    sourceId: 'drive',
    isCompleted: false,
    actionLabel: 'Open Drive',
    actionType: 'open_file',
    whyPrioritized: 'Routine maintenance to structure client deliverable folders.',
    contextEvidence: [
      {
        source: 'Google Drive',
        snippet: 'Unsorted PDF exports in Project Alpha root folder',
        timestamp: '6:00 PM',
      },
    ],
  },
  {
    id: 'cmd-6',
    time: '7:00 PM',
    title: 'Update Project Alpha docs',
    subtitle: 'Notion',
    priority: 'low',
    source: 'Notion',
    sourceIcon: 'notion',
    sourceId: 'notion',
    isCompleted: false,
    actionLabel: 'Open Notion Page',
    actionType: 'open_notes',
    whyPrioritized: 'Sync architecture documentation with latest API endpoint specs.',
    contextEvidence: [
      {
        source: 'Notion',
        snippet: 'Project Alpha Hub page updated by engineering',
        timestamp: '7:00 PM',
      },
    ],
  },
];

export const INITIAL_PRIORITY_SETTINGS: PrioritySettings = {
  deadlineSensitive: true,
  meetingsAndCollab: true,
  clientWork: true,
  deepWorkBias: true,
  quickWins: false,
};


export const MOCK_WHY_THIS_PLAN = {
  summary:
    'Nexorbit analyzed 11 active tasks, 3 calendar events, 14 recent emails, and 6 modified documents across your connected workspace.',
  drivers: [
    {
      title: 'Immediate Calendar Constraints',
      description: 'Project Alpha Sync starts at 9:30 AM with 4 stakeholders. Prioritized first for immediate alignment.',
      iconName: 'calendar',
      impact: 'High Impact',
    },
    {
      title: 'Client Communications Pressure',
      description: 'Rahul sent feedback on the proposal requiring a response before 1:00 PM.',
      iconName: 'mail',
      impact: 'Time-Critical',
    },
    {
      title: 'Protected Deep Work Window',
      description: 'Your biological peak energy window (9:00 AM – 11:00 AM) is protected for strategic reviews.',
      iconName: 'sparkles',
      impact: 'Focus Window',
    },
    {
      title: 'Goal Alignment',
      description: 'Directly advances "Enterprise Client Onboarding" Q3 primary milestone.',
      iconName: 'target',
      impact: 'Goal Progress',
    },
  ],
};
