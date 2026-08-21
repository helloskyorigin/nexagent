import { R1IntentResult } from './intentEngine';
import { MemoryRecord } from '../memory/memoryService';

export interface ChatMessageItem {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface RelevantFileExcerpt {
  fileName: string;
  excerpt: string;
  isFullContent: boolean;
}

export interface ResolvedReference {
  phrase: string;
  referent: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ActiveConversationState {
  currentTopic?: string;
  currentTask?: string;
  detectedEntities: string[];
  recentOptions: string[];
  hasUnresolvedContext: boolean;
}

export interface R2ContextPackage {
  selectedMessages: ChatMessageItem[];
  relevantMemories: MemoryRecord[];
  relevantFiles: RelevantFileExcerpt[];
  resolvedReferences: ResolvedReference[];
  activeState: ActiveConversationState;
  contextSummaryText: string;
}

/**
 * Tokenizes text into a set of lowercased significant keywords (ignoring common stop words).
 */
function extractKeywords(text: string): Set<string> {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'when', 'at', 'from',
    'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'to', 'of', 'in', 'on', 'is', 'are', 'was',
    'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'can',
    'could', 'should', 'would', 'may', 'might', 'must', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'their',
    'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'whose', 'why',
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such'
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  return new Set(words);
}

/**
 * Computes Jaccard/overlap similarity between two keyword sets.
 */
function computeKeywordOverlap(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let matches = 0;
  for (const word of setA) {
    if (setB.has(word)) matches++;
  }
  return matches / Math.min(setA.size, setB.size);
}

/**
 * Extract named entities, options, and structured bullet items from recent assistant text.
 */
function extractOptionsAndEntities(text: string): { options: string[]; entities: string[] } {
  const options: string[] = [];
  const entities: string[] = [];

  // Match numbered lists (1. Option A, 2. Option B)
  const numberedMatches = text.match(/^\s*(?:\d+[\.\)]|\([0-9]+\))\s+([^\n]+)/gm);
  if (numberedMatches) {
    numberedMatches.forEach(m => {
      const clean = m.replace(/^\s*(?:\d+[\.\)]|\([0-9]+\))\s+/, '').trim();
      if (clean.length > 0 && clean.length < 120) {
        options.push(clean);
      }
    });
  }

  // Match bulleted lists (- React: ..., * Vue: ...)
  const bulletMatches = text.match(/^\s*[\-\*•]\s+([^\n]+)/gm);
  if (bulletMatches && options.length === 0) {
    bulletMatches.forEach(m => {
      const clean = m.replace(/^\s*[\-\*•]\s+/, '').trim();
      if (clean.length > 0 && clean.length < 120) {
        options.push(clean);
      }
    });
  }

  // Match code blocks or tech keywords
  const codeMatches = text.match(/`([^`]+)`/g);
  if (codeMatches) {
    codeMatches.forEach(c => {
      const entity = c.replace(/`/g, '').trim();
      if (entity.length > 1 && entity.length < 40 && !entities.includes(entity)) {
        entities.push(entity);
      }
    });
  }

  return { options, entities };
}

/**
 * Resolves conversational references like "it", "this", "the second one", "the other option", "continue", etc.
 */
function resolveReferences(
  userQuery: string,
  r1Result: R1IntentResult,
  history: ChatMessageItem[]
): { resolved: ResolvedReference[]; activeState: ActiveConversationState } {
  const resolved: ResolvedReference[] = [];
  const qLower = userQuery.toLowerCase();

  // Find previous assistant and user messages
  const prevAssistant = [...history].reverse().find(m => m.role === 'assistant');
  const prevUser = [...history].reverse().find(m => m.role === 'user' && m.content !== userQuery);

  const prevText = prevAssistant?.content || prevUser?.content || '';
  const { options, entities } = extractOptionsAndEntities(prevText);

  // 1. Resolve ordinal / option references: "the first one", "the second one", "option 2", "the other one"
  if (options.length >= 2) {
    if (/\b(first|1st|first one|option 1|the first)\b/i.test(qLower) && options[0]) {
      resolved.push({
        phrase: 'first option',
        referent: options[0],
        confidence: 'HIGH'
      });
    }
    if (/\b(second|2nd|second one|option 2|the second)\b/i.test(qLower) && options[1]) {
      resolved.push({
        phrase: 'second option',
        referent: options[1],
        confidence: 'HIGH'
      });
    }
    if (/\b(third|3rd|third one|option 3|the third)\b/i.test(qLower) && options[2]) {
      resolved.push({
        phrase: 'third option',
        referent: options[2],
        confidence: 'HIGH'
      });
    }
    if (/\b(the other one|other option|alternative)\b/i.test(qLower)) {
      resolved.push({
        phrase: 'the other option',
        referent: options.length === 2 ? options[1] : options.slice(1).join(', '),
        confidence: 'MEDIUM'
      });
    }
  }

  // 2. Resolve continuation / plan references: "continue", "the plan from earlier", "step 2"
  if (/\b(continue|go on|keep going|next step|proceed)\b/i.test(qLower)) {
    if (prevAssistant) {
      const firstLine = prevAssistant.content.split('\n')[0].substring(0, 80);
      resolved.push({
        phrase: 'continuation',
        referent: `Continuing the preceding task: "${firstLine}"`,
        confidence: 'HIGH'
      });
    }
  }

  // 3. Resolve "the plan from earlier" or "the roadmap"
  if (/\b(the plan|the roadmap|the steps|the guide)\b/i.test(qLower)) {
    const planMsg = [...history].reverse().find(m => 
      m.role === 'assistant' && (m.content.toLowerCase().includes('plan') || m.content.toLowerCase().includes('step 1') || m.content.toLowerCase().includes('roadmap'))
    );
    if (planMsg) {
      resolved.push({
        phrase: 'earlier plan',
        referent: planMsg.content.substring(0, 150) + '...',
        confidence: 'HIGH'
      });
    }
  }

  // 4. Resolve "this code" / "fix this" / "that error"
  if (/\b(this code|the code|this error|the error|fix this|why does this fail)\b/i.test(qLower)) {
    const codeMsg = [...history].reverse().find(m => 
      m.content.includes('```') || m.content.toLowerCase().includes('error') || m.content.toLowerCase().includes('exception')
    );
    if (codeMsg) {
      resolved.push({
        phrase: 'target code/error',
        referent: codeMsg.content.substring(0, 200) + '...',
        confidence: 'HIGH'
      });
    }
  }

  // Derive active conversation state
  const lastUserText = prevUser?.content || userQuery;
  const activeTopic = lastUserText.length > 60 ? lastUserText.substring(0, 57) + '...' : lastUserText;

  const activeState: ActiveConversationState = {
    currentTopic: activeTopic,
    detectedEntities: entities,
    recentOptions: options,
    hasUnresolvedContext: r1Result.ambiguity === 'UNCLEAR' && resolved.length === 0 && history.length === 0
  };

  return { resolved, activeState };
}

/**
 * Filter and prioritize stored user memories based on their relevance to the current request.
 */
function selectRelevantMemories(
  userQuery: string,
  r1Result: R1IntentResult,
  memories: MemoryRecord[]
): MemoryRecord[] {
  if (!memories || memories.length === 0) return [];

  const qLower = userQuery.toLowerCase();
  const queryKeywords = extractKeywords(userQuery + ' ' + (r1Result.goal || ''));

  return memories.filter(memory => {
    const memText = (memory.content || '').toLowerCase();
    const memTitle = (memory.title || '').toLowerCase();
    const memCategory = memory.category || 'Facts';

    // 1. Global format & style preferences
    if (memCategory === 'Preferences' || memText.includes('prefer') || memText.includes('always') || memText.includes('concise') || memText.includes('short')) {
      // If user provided an explicit format/length constraint, the current prompt overrides memory
      if (r1Result.depth === 'DEEP' && (memText.includes('concise') || memText.includes('short'))) {
        // Current request explicitly asked for DEEP/exhaustive explanation -> exclude "concise" memory conflict
        return false;
      }
      if (r1Result.constraints.some(c => c.toLowerCase().includes('limit')) && memText.includes('detailed')) {
        return false;
      }

      // Check if this is a basic query where communication style applies
      if (r1Result.intent !== 'DEBUG' && !/^\d+[\+\-\*\/]/.test(qLower)) {
        return true;
      }
    }

    // 2. Technical skill & language facts (e.g. "I am a React developer", "I use TypeScript")
    if (memText.includes('react') || memText.includes('typescript') || memText.includes('python') || memText.includes('developer') || memText.includes('stack')) {
      const isTechQuery = r1Result.intent === 'DEBUG' || r1Result.intent === 'CREATE' || r1Result.intent === 'COMPARE' || 
        /(code|api|build|dev|software|app|framework|library|script|database)/i.test(qLower);
      if (isTechQuery) return true;
    }

    // 3. Specific entity or topic overlap
    const memKeywords = extractKeywords(memText + ' ' + memTitle);
    const overlap = computeKeywordOverlap(queryKeywords, memKeywords);
    if (overlap > 0.2) {
      return true;
    }

    // 4. Exact word match on significant terms
    for (const kw of queryKeywords) {
      if (kw.length >= 4 && (memText.includes(kw) || memTitle.includes(kw))) {
        return true;
      }
    }

    return false;
  });
}

/**
 * Extracts and retrieves the most relevant portions of attached files.
 */
function selectRelevantFileExcerpts(
  userQuery: string,
  r1Result: R1IntentResult,
  attachments?: Array<{ name: string; content: string }>
): RelevantFileExcerpt[] {
  if (!attachments || !Array.isArray(attachments) || attachments.length === 0) {
    return [];
  }

  const queryKeywords = extractKeywords(userQuery);
  const isBroadFileIntent = r1Result.intent === 'SUMMARIZE' || r1Result.intent === 'ANALYZE' ||
    /\b(summarize|overview|analyze all|full document|entire file|whole report)\b/i.test(userQuery);

  return attachments.map(file => {
    const content = file.content || '';

    // If small file or broad intent, include full content (up to safe token bounds)
    if (content.length <= 3000 || isBroadFileIntent) {
      return {
        fileName: file.name,
        excerpt: content.length > 8000 ? content.substring(0, 8000) + '\n...[Content truncated for length]' : content,
        isFullContent: content.length <= 8000
      };
    }

    // Otherwise, perform smart paragraph/line chunk scoring for targeted extraction
    const paragraphs = content.split(/\n\s*\n|\r\n\s*\r\n/);
    const scoredParagraphs = paragraphs.map((p, idx) => {
      const pKeywords = extractKeywords(p);
      const score = computeKeywordOverlap(queryKeywords, pKeywords);
      return { paragraph: p.trim(), score, index: idx };
    });

    // Sort by score and pick top relevant paragraphs
    const topParagraphs = scoredParagraphs
      .filter(sp => sp.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    if (topParagraphs.length > 0) {
      // Re-sort in document order
      topParagraphs.sort((a, b) => a.index - b.index);
      const excerpt = topParagraphs.map(tp => `[Section ${tp.index + 1}]:\n${tp.paragraph}`).join('\n\n---\n\n');
      return {
        fileName: file.name,
        excerpt: excerpt,
        isFullContent: false
      };
    }

    // Fallback: provide the first 2500 characters
    return {
      fileName: file.name,
      excerpt: content.substring(0, 2500) + (content.length > 2500 ? '\n...[Remaining document omitted for brevity]' : ''),
      isFullContent: content.length <= 2500
    };
  });
}

/**
 * Selects only recent and relevant conversation turns from message history.
 * Avoids sending all 20+ turns blindly; preserves conversational continuity and referenced past turns.
 */
function selectRelevantConversationTurns(
  userQuery: string,
  r1Result: R1IntentResult,
  history: ChatMessageItem[],
  resolvedRefs: ResolvedReference[],
  deepThinkEnabled?: boolean
): ChatMessageItem[] {
  if (!history || history.length === 0) return [];

  // Exclude current message if it's already at the end
  const pastTurns = history.filter(m => m.content !== userQuery);
  const minKeep = deepThinkEnabled ? 4 : 2;
  if (pastTurns.length <= minKeep) {
    return pastTurns;
  }

  const selectedIndices = new Set<number>();

  // 1. Keep the most recent turns (2 turns for normal, 4 turns for Deep Think) for immediate flow
  const total = pastTurns.length;
  const recentWindow = deepThinkEnabled ? 4 : 2;
  for (let k = 1; k <= Math.min(recentWindow, total); k++) {
    selectedIndices.add(total - k);
  }

  // 2. Score older turns based on topic & keyword overlap
  const queryKeywords = extractKeywords(userQuery + ' ' + (r1Result.goal || ''));
  const overlapThreshold = deepThinkEnabled ? 0.15 : 0.25;

  for (let i = 0; i < total - recentWindow; i++) {
    const turn = pastTurns[i];
    const turnKeywords = extractKeywords(turn.content);
    const overlap = computeKeywordOverlap(queryKeywords, turnKeywords);

    // If turn has strong topic overlap or contains referenced code/options
    if (overlap > overlapThreshold) {
      selectedIndices.add(i);
      // If user turn was selected, keep the subsequent assistant reply for context
      if (turn.role === 'user' && i + 1 < total) {
        selectedIndices.add(i + 1);
      }
    }

    // If any resolved reference matched content in this turn
    for (const ref of resolvedRefs) {
      if (ref.referent && turn.content.includes(ref.referent.substring(0, 30))) {
        selectedIndices.add(i);
      }
    }
  }

  // Convert set back to sorted array of turns
  const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b);
  return sortedIndices.map(idx => pastTurns[idx]);
}

/**
 * Main Entry Point for R2: Context Brain.
 * Seamlessly orchestrates context selection, reference resolution, and packaging.
 */
export function buildContextPackage(params: {
  userQuery: string;
  r1Result: R1IntentResult;
  historyMessages: ChatMessageItem[];
  availableMemories?: MemoryRecord[];
  attachments?: Array<{ name: string; content: string }>;
  deepThinkEnabled?: boolean;
}): R2ContextPackage {
  try {
    const { userQuery, r1Result, historyMessages, availableMemories = [], attachments = [], deepThinkEnabled } = params;

    // 1. Reference Resolution & Active State Tracking
    const { resolved: resolvedReferences, activeState } = resolveReferences(
      userQuery,
      r1Result,
      historyMessages
    );

    // 2. Memory Relevance Selection
    const relevantMemories = selectRelevantMemories(
      userQuery,
      r1Result,
      availableMemories
    );

    // 3. Targeted File Excerpt Selection
    const relevantFiles = selectRelevantFileExcerpts(
      userQuery,
      r1Result,
      attachments
    );

    // 4. Conversation Turn Pruning & Relevance Selection
    const selectedMessages = selectRelevantConversationTurns(
      userQuery,
      r1Result,
      historyMessages,
      resolvedReferences,
      deepThinkEnabled
    );

    // 5. Build Internal Context Package Directive
    let summaryParts: string[] = [];
    summaryParts.push('NEXORBIT R2 CONTEXT BRAIN (RELEVANT CONTEXT PACKAGE):');

    if (activeState.currentTopic) {
      summaryParts.push(`- ACTIVE TOPIC: ${activeState.currentTopic}`);
    }

    if (resolvedReferences.length > 0) {
      summaryParts.push('- RESOLVED REFERENCES:');
      resolvedReferences.forEach(r => {
        summaryParts.push(`  * "${r.phrase}" -> ${r.referent} (Confidence: ${r.confidence})`);
      });
    }

    if (relevantMemories.length > 0) {
      summaryParts.push('- RELEVANT USER PREFERENCES & FACTS:');
      relevantMemories.forEach(m => {
        summaryParts.push(`  * [${m.category}] ${m.content}`);
      });
    }

    if (relevantFiles.length > 0) {
      summaryParts.push('- RELEVANT FILE CONTEXT:');
      relevantFiles.forEach(f => {
        summaryParts.push(`  * File: ${f.fileName} (${f.isFullContent ? 'Full Document' : 'Targeted Excerpt'})`);
      });
    }

    summaryParts.push(`- CONTEXT PRIORITY ORDER: 1. Current user instruction > 2. Recent conversation > 3. Relevant older context > 4. File/Tool evidence > 5. User preferences.`);
    summaryParts.push('INSTRUCTIONS: Answer the user directly using the relevant context above. Do not reveal internal context headers or reference resolution metadata.');

    const contextSummaryText = summaryParts.join('\n');

    return {
      selectedMessages,
      relevantMemories,
      relevantFiles,
      resolvedReferences,
      activeState,
      contextSummaryText
    };
  } catch (error) {
    console.error('[R2 Context Brain Error] Fallback to minimal context:', error);
    // Graceful fallback to prevent any disruption to user chat
    return {
      selectedMessages: params.historyMessages.slice(-4),
      relevantMemories: params.availableMemories?.slice(0, 3) || [],
      relevantFiles: (params.attachments || []).map(a => ({
        fileName: a.name,
        excerpt: a.content.substring(0, 2000),
        isFullContent: a.content.length <= 2000
      })),
      resolvedReferences: [],
      activeState: {
        detectedEntities: [],
        recentOptions: [],
        hasUnresolvedContext: false
      },
      contextSummaryText: ''
    };
  }
}
