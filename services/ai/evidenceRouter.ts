import { R1IntentResult } from './intentEngine';
import { R2ContextPackage } from './contextBrain';

export type EvidenceMode =
  | 'MODEL_KNOWLEDGE'
  | 'CONVERSATION_CONTEXT'
  | 'MEMORY'
  | 'FILE'
  | 'WEB'
  | 'IMAGE_GENERATION'
  | 'CONNECTOR'
  | 'MULTI_SOURCE';

export interface R3RoutingDecision {
  evidenceMode: EvidenceMode;
  primarySources: string[];
  tools: string[];
  reason: string;
  executionPlan: string[];
  evidencePriority: string[];
  conflicts: string[];
  limitations: string[];
  synthesisInstructions: string[];
  routingSummaryText: string;
}

export interface RouterInputParams {
  userQuery: string;
  r1Result: R1IntentResult;
  r2Package: R2ContextPackage;
  webSearchEnabled?: boolean;
  braveApiKeyAvailable?: boolean;
  hasAttachments?: boolean;
  hasConnectors?: boolean;
  deepThinkEnabled?: boolean;
}

/**
 * Deterministic helper for intelligent auto web search detection
 */
export function shouldAutoSearch(query: string): boolean {
  if (!query || query.trim().length === 0) return false;

  const q = query.trim().toLowerCase();

  // 1. Exclude simple greetings & casual conversation
  if (/^(hi|hello|hey|greetings|good (morning|afternoon|evening)|how are you|who are you|what is your name|thanks|thank you)(\s*|\!|\.|\?)*$/.test(q)) {
    return false;
  }

  // 2. Exclude common coding/syntax queries unless explicit live docs/versions requested
  if (
    /^(how to|how do i|write a|create a|implement|function|code|class|component|script|css|html|regex|sql query)/.test(q) &&
    !/(latest version|new features in|released in|documentation for|current api|breaking changes)/.test(q)
  ) {
    if (/in (javascript|typescript|python|java|c\+\+|c#|react|next\.js|node|rust|go|php|ruby|swift|kotlin|git|bash|docker|css|html|sql)/.test(q)) {
      return false;
    }
  }

  // 3. Exclude math & basic calculation requests
  if (/^(\d+[\+\-\*\/\^%\s\(\)]+)+\d+$/.test(q) || /^solve\s+/i.test(q) || /^calculate\s+/i.test(q) || /^evaluate\s+/i.test(q)) {
    return false;
  }

  // 4. Exclude creative writing / transformation requests without live context
  if (/^(write a|compose a|draft a|write an|summarize|rewrite|translate|rephrase|paraphrase|proofread|format|explain the code)/.test(q) && !/(news|article|event|today|latest|current)/.test(q)) {
    return false;
  }

  // 5. Exclude static conceptual explanations
  if (/^explain\s+(photosynthesis|gravity|relativity|quantum|evolution|calculus|thermodynamics|mitosis|dna)/.test(q)) {
    return false;
  }

  // POSITIVE SIGNALS FOR AUTO SEARCH:

  // Explicit search intent phrases
  if (/(search (for|the web|online)|search .* online|look up|find online|check online|google|browse for|search web)/.test(q)) {
    return true;
  }

  // Temporal & freshness indicators
  if (/\b(today('s)?|tonight|yesterday|this week|this month|this year|right now|currently|latest|breaking news|up to date|recent|recently|live|2025|2026)\b/.test(q)) {
    return true;
  }

  // Real-time facts, financial, weather, sports & current state indicators
  if (
    /\b(weather|forecast|stock price|exchange rate|crypto|bitcoin|ethereum|market price|sports score|who won|match result|standings|election|winner|release date|movie times|flight status|current price|how much is|current ceo|current president|current prime minister|current governor|current status|score of)\b/.test(q)
  ) {
    return true;
  }

  // News & real-world events
  if (/\b(news|headline|event|announcement|launch of|scandal|happened (to|in|at)|what is happening|current situation)\b/.test(q)) {
    return true;
  }

  return false;
}

/**
 * Route and decide evidence requirements based on R1 Intent, R2 Context, and explicit instructions.
 */
export function routeEvidenceAndTools(params: RouterInputParams): R3RoutingDecision {
  const {
    userQuery,
    r1Result,
    r2Package,
    webSearchEnabled = false,
    braveApiKeyAvailable = true,
    hasAttachments = false,
    hasConnectors = false
  } = params;

  const qLower = userQuery.toLowerCase().trim();
  const activeSources: string[] = [];
  const tools: string[] = [];
  const plan: string[] = [];
  const conflicts: string[] = [];
  const limitations: string[] = [];
  const synthesisInstructions: string[] = [];

  // 1. Evaluate Web Search Requirement
  const explicitWeb = webSearchEnabled === true;
  const signalWeb = r1Result.webSearchIntent || shouldAutoSearch(userQuery);
  const isGreetingOrCasual = /^(hi|hello|hey|greetings|how are you|who are you|thanks|thank you)(\s*|\!|\.|\?)*$/i.test(qLower);
  
  const requiresWeb = !isGreetingOrCasual && (explicitWeb || signalWeb);

  if (requiresWeb) {
    activeSources.push('WEB');
    tools.push('brave_search');
    plan.push('Execute real-time Brave Web Search for verified current facts.');
    if (!braveApiKeyAvailable) {
      limitations.push('Live web search provider is currently unconfigured or unavailable.');
    }
  }

  // 2. Evaluate File Requirement
  const hasRelevantFiles = r2Package.relevantFiles && r2Package.relevantFiles.length > 0;
  const mentionsFile = /\b(pdf|spreadsheet|document|file|uploaded|attachment|csv|report)\b/i.test(qLower);
  const requiresFile = (hasAttachments && (hasRelevantFiles || mentionsFile || r1Result.fileIntent)) || hasRelevantFiles;

  if (requiresFile) {
    activeSources.push('FILE');
    tools.push('file_excerpt_engine');
    plan.push('Extract and prioritize verified text chunks from attached/uploaded files.');
  }

  // 3. Evaluate Image Generation Requirement
  const requiresImage = r1Result.imageIntent || /\b(create|generate|make|draw|paint|render|illustrate)\b.*?\b(image|picture|photo|illustration|artwork|diagram|drawing)\b/i.test(qLower);
  if (requiresImage) {
    activeSources.push('IMAGE_GENERATION');
    tools.push('image_generation_api');
    plan.push('Trigger visual generation parameters for creative illustration.');

    // If there is also an explanation or conceptual question, add MODEL_KNOWLEDGE as a complementary source
    if (r1Result.intent === 'EXPLAIN' || r1Result.intent === 'ASK' || r1Result.intent === 'COMPARE') {
      if (!activeSources.includes('MODEL_KNOWLEDGE')) {
        activeSources.unshift('MODEL_KNOWLEDGE');
      }
    }
  }

  // 4. Evaluate Connector Requirement
  const mentionsConnector = /\b(github|google drive|workspace|jira|slack|notion|hubspot)\b/i.test(qLower) && /\b(issue|pr|pull request|doc|ticket|channel|file|account)\b/i.test(qLower);
  const requiresConnector = hasConnectors && (r1Result.connectorIntent || mentionsConnector);
  if (requiresConnector) {
    activeSources.push('CONNECTOR');
    tools.push('workspace_connectors');
    plan.push('Query active third-party workspace connector API.');
  }

  // 5. Evaluate Memory Requirement
  const hasRelevantMemories = r2Package.relevantMemories && r2Package.relevantMemories.length > 0;
  const asksForMemory = /\b(my preferred|my style|my name|my stack|remember|as i usually|my preference)\b/i.test(qLower);
  const requiresMemory = hasRelevantMemories || asksForMemory;
  if (requiresMemory && !isGreetingOrCasual) {
    activeSources.push('MEMORY');
    plan.push('Incorporate relevant long-term user facts and style preferences.');
  }

  // 6. Evaluate Conversation Context Requirement
  const hasResolvedRefs = r2Package.resolvedReferences && r2Package.resolvedReferences.length > 0;
  const hasSelectedPastMessages = r2Package.selectedMessages && r2Package.selectedMessages.length > 0;
  const isFollowUp = hasResolvedRefs || /\b(earlier|previous|continue|as mentioned|the second one|that option|before)\b/i.test(qLower);
  const requiresContext = hasResolvedRefs || (hasSelectedPastMessages && isFollowUp);
  if (requiresContext && !isGreetingOrCasual) {
    activeSources.push('CONVERSATION_CONTEXT');
    plan.push('Apply resolved references and relevant previous conversation context.');
  }

  // 7. Determine Primary Evidence Mode
  let evidenceMode: EvidenceMode = 'MODEL_KNOWLEDGE';
  let reason = 'Answer directly using internal GPT-OSS 120B model knowledge.';

  if (activeSources.length > 1) {
    evidenceMode = 'MULTI_SOURCE';
    reason = `Multi-source synthesis required combining: ${activeSources.join(' + ')}.`;
  } else if (activeSources.length === 1) {
    evidenceMode = activeSources[0] as EvidenceMode;
    switch (evidenceMode) {
      case 'WEB':
        reason = 'Current external or real-time verification required.';
        break;
      case 'FILE':
        reason = 'User inquiry targets provided file/document content.';
        break;
      case 'IMAGE_GENERATION':
        reason = 'User explicitly requested image or visual creation.';
        break;
      case 'CONNECTOR':
        reason = 'External workspace or platform data requested.';
        break;
      case 'MEMORY':
        reason = 'User-specific preference or profile context applies.';
        break;
      case 'CONVERSATION_CONTEXT':
        reason = 'Query relies on previous conversational references or continuation.';
        break;
      default:
        evidenceMode = 'MODEL_KNOWLEDGE';
        reason = 'Direct model knowledge is sufficient.';
    }
  } else {
    evidenceMode = 'MODEL_KNOWLEDGE';
    activeSources.push('MODEL_KNOWLEDGE');
    reason = 'No external tool adds value; direct model answer is optimal.';
  }

  // 8. Build Evidence Priority Hierarchy
  const evidencePriority: string[] = [];
  if (evidenceMode === 'WEB' || (evidenceMode === 'MULTI_SOURCE' && activeSources.includes('WEB') && signalWeb)) {
    evidencePriority.push('1. Real-time Web Search evidence (authoritative for live facts/prices/events)');
    evidencePriority.push('2. User explicit instructions');
    evidencePriority.push('3. Attached file data');
    evidencePriority.push('4. Conversation context');
    evidencePriority.push('5. Memory');
    evidencePriority.push('6. Model knowledge');
  } else if (evidenceMode === 'FILE' || (evidenceMode === 'MULTI_SOURCE' && activeSources.includes('FILE'))) {
    evidencePriority.push('1. Attached file text (authoritative for document contents)');
    evidencePriority.push('2. User explicit instructions');
    evidencePriority.push('3. Web evidence (if requested)');
    evidencePriority.push('4. Conversation context');
    evidencePriority.push('5. Memory');
    evidencePriority.push('6. Model knowledge');
  } else {
    evidencePriority.push('1. Current explicit user instruction');
    evidencePriority.push('2. Relevant file evidence');
    evidencePriority.push('3. Relevant connector data');
    evidencePriority.push('4. Real-time web evidence');
    evidencePriority.push('5. Relevant conversation context');
    evidencePriority.push('6. Relevant stored memory');
    evidencePriority.push('7. Model knowledge');
  }

  // 9. Conflict & Synthesis Directives
  if (activeSources.includes('FILE') && activeSources.includes('WEB')) {
    conflicts.push('When file and web information differ, neutrally identify both perspectives rather than discarding either.');
  }

  if (activeSources.includes('WEB')) {
    synthesisInstructions.push('Ground live facts in verified search results; do not hallucinate unavailable web data.');
  }
  if (activeSources.includes('FILE')) {
    synthesisInstructions.push('Ground document answers in provided excerpts; state clearly if data is absent from the file.');
  }
  if (activeSources.includes('MEMORY')) {
    synthesisInstructions.push('Silently apply user preferences unless overridden by current prompt constraints.');
  }

  // 10. Compile Internal Routing Summary for System Prompt
  const summaryLines: string[] = [
    'NEXORBIT R3 EVIDENCE & TOOL ROUTER (INTERNAL CONTEXT):',
    `- EVIDENCE MODE: ${evidenceMode}`,
    `- PRIMARY SOURCES: ${activeSources.join(', ')}`,
    `- TOOLS TRIGGERED: ${tools.length > 0 ? tools.join(', ') : 'NONE (Direct Model Execution)'}`,
    `- ROUTING REASON: ${reason}`,
  ];

  if (plan.length > 0) {
    summaryLines.push(`- EXECUTION PLAN:\n  * ${plan.join('\n  * ')}`);
  }

  if (conflicts.length > 0) {
    summaryLines.push(`- CONFLICT DIRECTIVES:\n  * ${conflicts.join('\n  * ')}`);
  }

  if (limitations.length > 0) {
    summaryLines.push(`- LIMITATIONS & NOTICES:\n  * ${limitations.join('\n  * ')}`);
  }

  summaryLines.push(`- EVIDENCE PRIORITY:\n  * ${evidencePriority.slice(0, 4).join('\n  * ')}`);
  summaryLines.push('INSTRUCTIONS: Answer the user strictly adhering to the selected evidence sources and priority order above. Never mention R1, R2, or R3 internals in your final user-facing response.');

  const routingSummaryText = summaryLines.join('\n');

  return {
    evidenceMode,
    primarySources: activeSources,
    tools,
    reason,
    executionPlan: plan,
    evidencePriority,
    conflicts,
    limitations,
    synthesisInstructions,
    routingSummaryText,
  };
}
