import { AIMode, ChatMessage, SourceReference, FindingItem, ChatAction, DocumentCardData, MemoryContextData } from './types';

export const MOCK_CHAT_SOURCES: Record<string, SourceReference> = {
  driveProposal: {
    id: 'src-drive-1',
    connector: 'drive',
    connectorName: 'Google Drive',
    title: 'proposal_v2.3.pdf',
    snippet: 'Proposal v2.3 includes revised timeline Aug 2024 - Feb 2025, +12% budget breakdown, client feedback.',
    timestamp: 'Updated May 11, 2024',
    iconType: 'drive',
  },
  gmailAlpha: {
    id: 'src-gmail-1',
    connector: 'gmail',
    connectorName: 'Gmail',
    title: 'Re: Project Alpha Proposal',
    snippet: 'Rahul Mehta: "We reviewed the proposal and have 3 additional feature requests for v2.3."',
    timestamp: 'Today, 9:15 AM',
    sender: 'Rahul Mehta <rahul@alpha-client.com>',
    iconType: 'gmail',
  },
  notionRoadmap: {
    id: 'src-notion-1',
    connector: 'notion',
    connectorName: 'Notion',
    title: 'Project Alpha Hub',
    snippet: 'Notion Hub tracking milestones, specs, deliverables, and review meeting on May 15.',
    timestamp: 'Yesterday, 5:30 PM',
    iconType: 'notion',
  },
  calendarSync: {
    id: 'src-cal-1',
    connector: 'calendar',
    connectorName: 'Calendar',
    title: 'Project Alpha Review Meeting',
    snippet: 'Event scheduled for May 15, 10:00 AM with Client stakeholders & Dev Leads.',
    timestamp: 'May 15, 10:00 AM',
    sender: 'Google Calendar',
    iconType: 'calendar',
  },
  calendarClientCall: {
    id: 'src-cal-2',
    connector: 'calendar',
    connectorName: 'Calendar',
    title: 'Client Review & Feedback Session',
    snippet: 'Event scheduled for Tomorrow 1:30 PM with Rahul Mehta and Product Operations.',
    timestamp: 'Tomorrow, 1:30 PM',
    sender: 'Google Calendar',
    iconType: 'calendar',
  },
  githubPr: {
    id: 'src-github-1',
    connector: 'github',
    connectorName: 'GitHub',
    title: 'PR #142: Core API Alignment & Telemetry',
    snippet: 'Merged by Aryan into main. CI/CD automated tests passing 100%.',
    timestamp: 'Aug 12, 2:10 PM',
    iconType: 'github',
  },
};

export const MOCK_CHAT_ACTIONS: ChatAction[] = [
  { id: 'act-drive', label: 'Open in Drive', actionType: 'open_source', icon: 'drive' },
  { id: 'act-share', label: 'Share', actionType: 'share', icon: 'share' },
  { id: 'act-notion', label: 'Add to Notion', actionType: 'add_to_notion', icon: 'notion' },
  { id: 'act-task', label: 'Create follow-up task', actionType: 'create_task', icon: 'task' },
];

export const MOCK_MEMORY_DATA: MemoryContextData = {
  id: 'mem-1',
  text: 'You asked about Project Alpha proposal 3 times this week.',
  actionText: 'View related memories',
  relatedCount: 3,
};

export function generateAIResponse(query: string, mode: AIMode): {
  text: string;
  document?: DocumentCardData;
  highlights?: string[];
  sourcesUsed?: SourceReference[];
  findings?: FindingItem[];
  actions?: ChatAction[];
  memoryContext?: MemoryContextData;
} {
  const q = query.toLowerCase().trim();

  // 1. Project Alpha Proposal / Latest proposal search (Exact match from reference)
  if (q.includes('proposal') || q.includes('project alpha') || q.includes('latest proposal') || q.includes('alpha proposal') || q.includes('alpha')) {
    return {
      text: `Here's the latest Project Alpha proposal I found.\n\nThe newest version is Proposal v2.3, updated yesterday by you. It includes the revised timeline, budget breakdown, and client feedback summary.`,
      document: {
        title: 'Project Alpha Proposal v2.3.pdf',
        source: 'Google Drive',
        updatedAt: 'Updated May 11, 2024',
        fileType: 'pdf',
      },
      highlights: [
        'Timeline moved to Aug 2024 – Feb 2025',
        'Budget increased by 12%',
        'Client requested 3 additional features',
        'Next review meeting on May 15',
      ],
      sourcesUsed: [
        MOCK_CHAT_SOURCES.driveProposal,
        MOCK_CHAT_SOURCES.gmailAlpha,
        MOCK_CHAT_SOURCES.notionRoadmap,
        MOCK_CHAT_SOURCES.calendarSync,
      ],
      actions: MOCK_CHAT_ACTIONS,
      memoryContext: MOCK_MEMORY_DATA,
    };
  }

  // 2. Quantum Computing / General Knowledge
  if (q.includes('quantum') || (mode === 'general' && (q.includes('what is') || q.includes('explain')))) {
    return {
      text: `**Quantum computing** is a multidisciplinary field comprising aspects of computer science, physics, and mathematics that utilizes the principles of quantum mechanics to solve complex problems faster than classical computers.\n\n### Core Principles:\n1. **Superposition**: Unlike classical bits that represent either 0 or 1, quantum bits (**qubits**) can exist in multidimensional states.\n2. **Entanglement**: Qubits can become intrinsically linked such that the quantum state of one instantaneously determines the other.\n3. **Quantum Interference**: Quantum algorithms use interference patterns to amplify correct computational pathways.`,
      highlights: [
        'Superposition enables simultaneous state evaluation',
        'Entanglement correlates separated qubits instantaneously',
        'Interference amplifies constructive probability amplitudes',
      ],
      actions: [
        { id: 'act-copy', label: 'Copy Explanation', actionType: 'copy_text' },
        { id: 'act-share-q', label: 'Share', actionType: 'share' },
      ],
    };
  }

  // 3. Email Writing / Text Generation
  if (q.includes('write') && (q.includes('email') || q.includes('message') || q.includes('reply') || q.includes('proposal'))) {
    return {
      text: `Here is a refined, professional email draft tailored for high clarity and executive polish:\n\n**Subject:** Update on Project Alpha Deliverables & Timeline Alignment\n\n**Hi Rahul,**\n\nThank you for sending over the latest notes. I wanted to quickly touch base regarding our upcoming milestone targets.\n\nWe are currently tracking ahead of schedule on core deliverables. To ensure comprehensive QA coverage, our timeline is structured for final sign-off by **Monday morning**.\n\nLet's review the final checklist during our scheduled sync **tomorrow at 10:00 AM**.\n\nBest regards,\n**Satyam**\n*Lead Architect, Nexorbit*`,
      actions: [
        { id: 'act-copy-email', label: 'Copy Email Draft', actionType: 'copy_text' },
        { id: 'act-send-gmail', label: 'Open in Gmail Composer', actionType: 'draft_reply' },
      ],
    };
  }

  // 4. Summarize key changes / Client feedback / Compare follow-ups
  if (q.includes('summarize key changes') || q.includes('key changes') || q.includes('changes')) {
    return {
      text: `Here is the comprehensive summary of key changes in **Proposal v2.3** compared to v2.2:\n\n1. **Delivery Window Extension**: Shifted final milestone from December 2024 to February 2025 to accommodate security audits.\n2. **Budget Allocation Adjustment**: Added $18,500 (+12%) for cloud infrastructure scaling and dedicated staging environments.\n3. **Extended Scope**: Included SSO (SAML/Okta) authentication and automated multi-region backup replication.`,
      highlights: [
        'Delivery window extended by 2 months',
        'Budget revised to account for infrastructure scaling',
        'Enterprise SSO requirement integrated',
      ],
      sourcesUsed: [MOCK_CHAT_SOURCES.driveProposal, MOCK_CHAT_SOURCES.notionRoadmap],
      actions: MOCK_CHAT_ACTIONS,
      memoryContext: MOCK_MEMORY_DATA,
    };
  }

  if (q.includes('client feedback') || q.includes('show client feedback')) {
    return {
      text: `Here is the client feedback logged from **Rahul Mehta** via Gmail & Notion:\n\n> *"The overall architectural foundation looks solid. Our stakeholders have requested priority integration for Google Workspace OAuth and an automated compliance report export before public launch."*\n\n### Action Items:\n- Review OAuth scope consent workflow in Google Cloud console.\n- Schedule technical review with Rahul on May 15 at 10:00 AM.`,
      highlights: [
        'Client approved core architecture',
        'Requested OAuth & Compliance export features',
        'Review meeting confirmed for May 15',
      ],
      sourcesUsed: [MOCK_CHAT_SOURCES.gmailAlpha, MOCK_CHAT_SOURCES.notionRoadmap],
      actions: MOCK_CHAT_ACTIONS,
      memoryContext: MOCK_MEMORY_DATA,
    };
  }

  if (q.includes('compare with v2.2') || q.includes('compare')) {
    return {
      text: `### Diff: Proposal v2.2 vs Proposal v2.3\n\n| Attribute | Proposal v2.2 | Proposal v2.3 (Latest) |\n| :--- | :--- | :--- |\n| **Target Timeline** | Aug 2024 – Dec 2024 | Aug 2024 – Feb 2025 |\n| **Total Budget** | $154,000 | $172,500 (+12%) |\n| **Core Integrations** | Drive, Gmail | Drive, Gmail, Notion, Calendar |\n| **Status** | Superseded | Active Under Review |`,
      sourcesUsed: [MOCK_CHAT_SOURCES.driveProposal],
      actions: MOCK_CHAT_ACTIONS,
    };
  }

  // 5. Meetings / Calendar queries
  if (q.includes('meeting') || q.includes('calendar') || q.includes('events')) {
    const sources = [MOCK_CHAT_SOURCES.calendarSync, MOCK_CHAT_SOURCES.calendarClientCall];
    return {
      text: `You have **2 upcoming meetings** scheduled on your Google Calendar:\n\n1. **Project Alpha Review Meeting** (May 15, 10:00 AM – 10:45 AM)\n   - **Attendees**: Rahul Mehta, Client Stakeholders, Dev Leads\n   - **Agenda**: Proposal v2.3 walkthrough & sign-off.\n\n2. **Client Review & Feedback Session** (Tomorrow, 1:30 PM – 2:15 PM)\n   - **Location**: Google Meet`,
      sourcesUsed: sources,
      actions: [
        { id: 'act-view-cal', label: 'Open Google Calendar', actionType: 'view_meeting' },
        { id: 'act-share', label: 'Share Schedule', actionType: 'share' },
      ],
    };
  }

  // Default Universal Response
  const isConnectedSearch = mode === 'connected' || (mode === 'auto' && (q.includes('my') || q.includes('team') || q.includes('project')));

  if (isConnectedSearch) {
    const sources = [MOCK_CHAT_SOURCES.driveProposal, MOCK_CHAT_SOURCES.notionRoadmap, MOCK_CHAT_SOURCES.gmailAlpha];
    return {
      text: `Based on your connected workspace records across **Google Drive**, **Notion**, and **Gmail**:\n\n- **Workspace Context**: Active records indexed across 4 connected services.\n- **Relevant Insight**: Found 3 matching documents and 2 recent thread updates matching "${query}".\n\nWould you like me to summarize any specific document or prepare a draft?`,
      sourcesUsed: sources,
      actions: MOCK_CHAT_ACTIONS,
      memoryContext: MOCK_MEMORY_DATA,
    };
  }

  return {
    text: `Here is the analysis for: **"${query}"**\n\n1. **Strategic Assessment**: Clear objective alignment across your workflow.\n2. **Execution Steps**: Incremental milestones structured for high accuracy.\n3. **Tools & Integrations**: Nexorbit can draft content, review files, or manage connected apps whenever needed.`,
    actions: [
      { id: 'act-copy-default', label: 'Copy Answer', actionType: 'copy_text' },
      { id: 'act-share-default', label: 'Share', actionType: 'share' },
    ],
  };
}
