import {
  AskConversation,
  SourceItem,
  AskResponseData,
  ContextEntity,
  RelatedItem,
} from './types';

export const MOCK_SOURCES: SourceItem[] = [
  {
    id: 'src-gmail-1',
    connector: 'gmail',
    connectorName: 'Gmail',
    title: 'Project Alpha spec review & timeline',
    snippet: 'Rahul mentioned: "We are aiming for Friday COB to submit the final spec review before release."',
    timestamp: 'Today, 9:15 AM',
    sender: 'Rahul Mehta <rahul@alpha-client.com>',
  },
  {
    id: 'src-cal-1',
    connector: 'calendar',
    connectorName: 'Calendar',
    title: 'Project Alpha Sync',
    snippet: 'Event scheduled for Tomorrow 10:00 AM with Rahul Mehta, Aryan, and Dev Leads.',
    timestamp: 'Tomorrow, 10:00 AM',
    sender: 'Google Calendar (Sync Room)',
  },
  {
    id: 'src-drive-1',
    connector: 'drive',
    connectorName: 'Drive',
    title: 'Project_Alpha_Master_Brief_v2.pdf',
    snippet: 'Section 4.1 Target Timeline explicitly notes Monday August 18 as the core delivery sign-off date.',
    timestamp: 'Updated Aug 11',
    sender: 'Product Strategy Folder',
  },
  {
    id: 'src-notion-1',
    connector: 'notion',
    connectorName: 'Notion',
    title: 'Alpha Engineering Roadmap',
    snippet: 'Sprint 14 tracking: 8 tasks completed, 2 in code review, deadline aligned with v2 brief.',
    timestamp: 'Yesterday, 5:30 PM',
  },
  {
    id: 'src-github-1',
    connector: 'github',
    connectorName: 'GitHub',
    title: 'Pull Request #142: Core API Alignment',
    snippet: 'Merged by Aryan into main. CI/CD verified all automated smoke tests.',
    timestamp: 'Aug 12, 2:10 PM',
  },
];

export const MOCK_PROJECT_ALPHA_RESPONSE: AskResponseData = {
  id: 'resp-alpha-main',
  summaryText: 'Yes. I found 3 things worth your attention.',
  timestamp: 'Today, 9:24 AM',
  findings: [
    {
      id: 'find-1',
      type: 'conflict',
      title: 'Deadline conflict',
      timestamp: '2 min ago',
      description:
        'Your latest client email mentions Friday, while your calendar and project document show a different deadline.',
      sources: [MOCK_SOURCES[0], MOCK_SOURCES[1], MOCK_SOURCES[2]],
      actionLabel: 'Review conflict →',
      actionType: 'review_conflict',
    },
    {
      id: 'find-2',
      type: 'pending',
      title: 'Client response pending',
      timestamp: '15 min ago',
      description: "Rahul hasn't responded to the latest project discussion.",
      sources: [MOCK_SOURCES[0]],
      actionLabel: 'Open conversation →',
      actionType: 'open_conversation',
    },
    {
      id: 'find-3',
      type: 'meeting',
      title: 'Meeting tomorrow',
      timestamp: '30 min ago',
      description: 'Project Alpha sync is scheduled for 10:00 AM.',
      sources: [MOCK_SOURCES[1]],
      actionLabel: 'View meeting →',
      actionType: 'view_meeting',
    },
  ],
  recommendedNextStep: {
    text: 'Resolve the deadline before the meeting.',
    actionLabel: 'Prepare response →',
  },
  sources: MOCK_SOURCES,
  whyExplanation:
    'Nexorbit detected contradictory delivery targets between Rahul’s direct email thread and the master project brief.',
};

export const MOCK_RISK_RESPONSE: AskResponseData = {
  id: 'resp-risk-alpha',
  summaryText: 'The single biggest risk is unaligned expectations on Friday deliverables.',
  timestamp: 'Just now',
  findings: [
    {
      id: 'find-risk-1',
      type: 'conflict',
      title: 'Expectation Mismatch',
      timestamp: 'Just now',
      description:
        'If Rahul expects production assets by Friday 5:00 PM while engineering is scheduled through Monday, the sync tomorrow may become contentious.',
      sources: [MOCK_SOURCES[0], MOCK_SOURCES[2]],
      actionLabel: 'Review conflict →',
      actionType: 'review_conflict',
    },
    {
      id: 'find-risk-2',
      type: 'pending',
      title: 'QA Sign-off Pending',
      timestamp: '10 min ago',
      description: 'Test suite validation is currently scheduled for Friday afternoon.',
      sources: [MOCK_SOURCES[3]],
      actionLabel: 'Open conversation →',
      actionType: 'open_conversation',
    },
  ],
  recommendedNextStep: {
    text: 'Send a pre-meeting clarifying email to confirm Monday as the official date.',
    actionLabel: 'Prepare response →',
  },
  sources: [MOCK_SOURCES[0], MOCK_SOURCES[2]],
  whyExplanation: 'Synthesized from timeline commitments across Gmail and Notion.',
};

export const MOCK_SOURCES_RESPONSE: AskResponseData = {
  id: 'resp-sources-alpha',
  summaryText: 'Here are the primary sources backing these insights.',
  timestamp: 'Just now',
  findings: [
    {
      id: 'find-src-1',
      type: 'info',
      title: 'Gmail: Project Alpha spec review',
      timestamp: 'Today, 9:15 AM',
      description: 'Rahul Mehta writes: "We are aiming for Friday COB to submit the final spec review before release."',
      sources: [MOCK_SOURCES[0]],
      actionLabel: 'Open conversation →',
      actionType: 'open_conversation',
    },
    {
      id: 'find-src-2',
      type: 'info',
      title: 'Google Drive: Project_Alpha_Master_Brief_v2.pdf',
      timestamp: 'Updated Aug 11',
      description: 'Section 4.1 specifies final sign-off is Monday August 18.',
      sources: [MOCK_SOURCES[2]],
      actionLabel: 'Review conflict →',
      actionType: 'review_conflict',
    },
    {
      id: 'find-src-3',
      type: 'meeting',
      title: 'Google Calendar: Project Alpha Sync',
      timestamp: 'Tomorrow, 10:00 AM',
      description: '30-minute sync scheduled to review deliverables.',
      sources: [MOCK_SOURCES[1]],
      actionLabel: 'View meeting →',
      actionType: 'view_meeting',
    },
  ],
  recommendedNextStep: {
    text: 'Share the updated brief link with Rahul.',
    actionLabel: 'Prepare response →',
  },
  sources: MOCK_SOURCES,
};

export const MOCK_SUMMARIZE_RESPONSE: AskResponseData = {
  id: 'resp-summary-alpha',
  summaryText: 'Summary: Project Alpha is on track technically, but schedule alignment is needed immediately.',
  timestamp: 'Just now',
  findings: [
    {
      id: 'find-sum-1',
      type: 'conflict',
      title: 'Schedule Discrepancy',
      timestamp: '2 min ago',
      description: 'Client email says Friday; master brief says Monday. Recommended resolution is to send a quick clarification.',
      sources: [MOCK_SOURCES[0], MOCK_SOURCES[2]],
      actionLabel: 'Review conflict →',
      actionType: 'review_conflict',
    },
    {
      id: 'find-sum-2',
      type: 'meeting',
      title: 'Tomorrow’s Meeting Agenda',
      timestamp: '30 min ago',
      description: '10:00 AM sync will cover architecture, API delivery, and timeline confirmation.',
      sources: [MOCK_SOURCES[1]],
      actionLabel: 'View meeting →',
      actionType: 'view_meeting',
    },
  ],
  recommendedNextStep: {
    text: 'Prepare briefing notes for the 10:00 AM meeting.',
    actionLabel: 'Prepare response →',
  },
  sources: MOCK_SOURCES,
};

export const CONTEXT_ENTITIES: ContextEntity[] = [
  {
    id: 'ctx-project-alpha',
    title: 'Project Alpha',
    subtitle: 'Active project',
    type: 'project',
    details: [
      'Core Client: Rahul Mehta',
      'Target Date: Monday Aug 18',
      'Sprint Status: On Track (85%)',
    ],
  },
  {
    id: 'ctx-rahul',
    title: 'Rahul',
    subtitle: 'Client',
    type: 'person',
    details: [
      'Email: rahul@alpha-client.com',
      'Company: Alpha Innovations LLC',
      'Role: Lead Product Stakeholder',
    ],
  },
  {
    id: 'ctx-emails',
    title: '3 related emails',
    subtitle: 'Gmail',
    type: 'email',
    countText: '3 threads',
  },
  {
    id: 'ctx-meetings',
    title: '1 meeting',
    subtitle: 'Calendar',
    type: 'event',
    countText: 'Tomorrow 10:00 AM',
  },
  {
    id: 'ctx-docs',
    title: '2 documents',
    subtitle: 'Drive',
    type: 'doc',
    countText: 'Proposal & Spec Brief',
  },
];

export const RELATED_ITEMS: RelatedItem[] = [
  {
    id: 'rel-1',
    title: 'Project Alpha',
    connector: 'gmail',
    connectorName: 'Gmail',
  },
  {
    id: 'rel-2',
    title: 'Deadline Confusion',
    connector: 'drive',
    connectorName: 'Drive',
  },
  {
    id: 'rel-3',
    title: 'Project Alpha Sync',
    connector: 'calendar',
    connectorName: 'Calendar',
  },
];

export const FOLLOW_UP_SUGGESTIONS = [
  "What's the biggest risk?",
  'Show the sources',
  'Summarize this',
];

export const INITIAL_CONVERSATIONS: AskConversation[] = [
  {
    id: 'conv-project-alpha',
    title: 'Project Alpha status',
    updatedAt: 'Today, 9:24 AM',
    previewText: 'Is there anything important I should know about Project Alpha?',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'Is there anything important I should know about Project Alpha?',
        timestamp: 'Today, 9:24 AM',
      },
      {
        id: 'msg-2',
        sender: 'ai',
        text: 'Yes. I found 3 things worth your attention.',
        timestamp: 'Today, 9:24 AM',
        aiData: MOCK_PROJECT_ALPHA_RESPONSE,
      },
    ],
  },
  {
    id: 'conv-changed-week',
    title: 'What changed this week?',
    updatedAt: 'Yesterday',
    previewText: 'Summarize updates across Gmail, Calendar, and Drive.',
    messages: [
      {
        id: 'msg-w1',
        sender: 'user',
        text: 'What changed this week?',
        timestamp: 'Yesterday, 4:00 PM',
      },
      {
        id: 'msg-w2',
        sender: 'ai',
        text: 'Here is what changed across your workspace this week.',
        timestamp: 'Yesterday, 4:00 PM',
        aiData: {
          id: 'resp-w2',
          summaryText: 'I detected 4 major updates across your connected apps.',
          timestamp: 'Yesterday, 4:00 PM',
          findings: [
            {
              id: 'find-w1',
              type: 'info',
              title: 'Proposal updated',
              timestamp: 'Yesterday',
              description: 'Alpha_Launch_Doc_v2.pdf was updated by Product Lead.',
              sources: [MOCK_SOURCES[2]],
              actionLabel: 'Review document →',
              actionType: 'general',
            },
            {
              id: 'find-w2',
              type: 'meeting',
              title: 'Design Review rescheduled',
              timestamp: '2 days ago',
              description: 'Moved from Thursday 2:00 PM to Friday 11:00 AM.',
              sources: [MOCK_SOURCES[1]],
              actionLabel: 'View meeting →',
              actionType: 'view_meeting',
            },
          ],
          recommendedNextStep: {
            text: 'Review the proposal changes before tomorrow.',
            actionLabel: 'Open document →',
          },
          sources: MOCK_SOURCES,
        },
      },
    ],
  },
  {
    id: 'conv-tomorrow-meeting',
    title: 'Prepare tomorrow’s meeting',
    updatedAt: '2 days ago',
    previewText: 'Briefing notes for 10:00 AM Project Alpha Sync.',
    messages: [
      {
        id: 'msg-m1',
        sender: 'user',
        text: 'Prepare briefing notes for tomorrow’s meeting.',
        timestamp: '2 days ago',
      },
      {
        id: 'msg-m2',
        sender: 'ai',
        text: 'Prepared meeting brief for Project Alpha Sync.',
        timestamp: '2 days ago',
        aiData: {
          id: 'resp-m2',
          summaryText: 'Here are the key discussion topics for the 10:00 AM sync.',
          timestamp: '2 days ago',
          findings: [
            {
              id: 'find-m1',
              type: 'meeting',
              title: 'Attendee agenda items',
              timestamp: '2 days ago',
              description: 'Rahul requested review on backend latency and security spec compliance.',
              sources: [MOCK_SOURCES[0], MOCK_SOURCES[1]],
              actionLabel: 'View agenda →',
              actionType: 'view_meeting',
            },
          ],
          recommendedNextStep: {
            text: 'Send agenda to attendees 1 hour before.',
            actionLabel: 'Send agenda →',
          },
          sources: [MOCK_SOURCES[0], MOCK_SOURCES[1]],
        },
      },
    ],
  },
  {
    id: 'conv-latest-proposal',
    title: 'Find latest proposal',
    updatedAt: 'Aug 10',
    previewText: 'Where is the latest Project Alpha proposal document?',
    messages: [
      {
        id: 'msg-p1',
        sender: 'user',
        text: 'Where is the latest proposal?',
        timestamp: 'Aug 10',
      },
      {
        id: 'msg-p2',
        sender: 'ai',
        text: 'Found Project_Alpha_Master_Brief_v2.pdf in Google Drive.',
        timestamp: 'Aug 10',
        aiData: {
          id: 'resp-p2',
          summaryText: 'Located 2 related proposal files.',
          timestamp: 'Aug 10',
          findings: [
            {
              id: 'find-p1',
              type: 'info',
              title: 'Project Alpha Master Brief v2.pdf',
              timestamp: 'Aug 10',
              description: 'Stored in Google Drive / Client Proposals. Last edited by Lead Strategist.',
              sources: [MOCK_SOURCES[2]],
              actionLabel: 'Open file →',
              actionType: 'general',
            },
          ],
          recommendedNextStep: {
            text: 'Review change history in Google Drive.',
            actionLabel: 'Open Google Drive →',
          },
          sources: [MOCK_SOURCES[2]],
        },
      },
    ],
  },
];

export const EMPTY_STATE_SUGGESTIONS = [
  {
    category: 'Understand',
    prompt: 'Is there anything important I should know about Project Alpha?',
    label: 'What should I know about Project Alpha?',
  },
  {
    category: 'Find',
    prompt: 'Find the latest proposal document and recent client feedback.',
    label: 'Find latest proposal & feedback',
  },
  {
    category: 'Connect',
    prompt: 'Are there any deadline conflicts between my emails and calendar?',
    label: 'Check deadline conflicts across apps',
  },
  {
    category: 'Act',
    prompt: 'Draft a follow-up response to Rahul regarding our timeline.',
    label: 'Prepare follow-up draft for client',
  },
];
