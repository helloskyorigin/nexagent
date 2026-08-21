import { R1IntentResult } from './intentEngine';
import { R2ContextPackage } from './contextBrain';
import { R3RoutingDecision } from './evidenceRouter';

export type ResponseFormat =
  | 'PARAGRAPH'
  | 'BULLETS'
  | 'NUMBERED_STEPS'
  | 'TABLE'
  | 'CHECKLIST'
  | 'CODE'
  | 'EXPLANATION_PLUS_CODE'
  | 'COMPARISON'
  | 'PLAN'
  | 'HYBRID';

export interface R4ResponseStrategy {
  depth: 'MICRO' | 'SHORT' | 'NORMAL' | 'DETAILED' | 'DEEP';
  format: ResponseFormat;
  tone: 'CASUAL' | 'DIRECT' | 'PROFESSIONAL' | 'TEACHING' | 'TECHNICAL' | 'FRIENDLY' | 'FORMAL';
  language: string;
  directness: 'IMMEDIATE_ANSWER' | 'BALANCED' | 'EXPLORATORY';
  actionability: 'NONE' | 'PRACTICAL_STEPS' | 'CODE_ACTIONABLE' | 'DECISION_GUIDANCE' | 'THEORETICAL';
  structureBlueprint: string[];
  strategySummaryText: string;
}

/**
  Generate structural blueprint based on format, intent, and depth
 */
function buildStructureBlueprint(
  format: ResponseFormat,
  r1Result: R1IntentResult,
  depth: 'MICRO' | 'SHORT' | 'NORMAL' | 'DETAILED' | 'DEEP'
): string[] {
  if (depth === 'MICRO' || format === 'CODE') {
    return [
      '1. Clean, functional code snippet (with minimal syntax comments)',
      '2. Brief 1-sentence usage or command note'
    ];
  }

  if (format === 'NUMBERED_STEPS') {
    return [
      '1. Direct summary of the overall procedure',
      '2. Numbered sequential steps with actionable commands/actions',
      '3. Verification checkpoint or key pitfall to avoid'
    ];
  }

  if (format === 'BULLETS') {
    return [
      '1. Direct high-level answer line',
      '2. Concise, distinct bullet points addressing the core requirements',
      '3. Brief practical summary'
    ];
  }

  if (format === 'COMPARISON' || r1Result.intent === 'COMPARE') {
    return [
      '1. High-level Summary / Core Distinction',
      '2. Structured Comparison (Key criteria: performance, simplicity, ecosystem)',
      '3. Clear Recommendation (When to use Option A vs Option B)'
    ];
  }

  if (format === 'PLAN' || r1Result.intent === 'PLAN') {
    return [
      '1. Strategic Objective & Scope',
      '2. Actionable Phases / Step-by-Step Milestones',
      '3. Critical Dependencies & Risks',
      '4. Immediate Next Step'
    ];
  }

  if (format === 'EXPLANATION_PLUS_CODE' || r1Result.intent === 'DEBUG') {
    return [
      '1. Root Cause: Precise explanation of why the issue occurred',
      '2. Corrected Code: Clean drop-in solution',
      '3. Key Fix Summary: What was changed & verification check'
    ];
  }

  if (depth === 'DEEP') {
    return [
      '1. Direct Conclusion / Executive Summary',
      '2. Deep Theoretical & Mechanical Explanation',
      '3. Real-world Implementation / Illustrative Example',
      '4. Trade-offs, Edge Cases, & Caveats',
      '5. Practical Actionable Takeaway'
    ];
  }

  // Default NORMAL / PARAGRAPH blueprint
  return [
    '1. Direct Answer immediately to the core question',
    '2. Key Explanation & intuitive mechanics',
    '3. Concrete example or practical detail if helpful'
  ];
}

/**
 * Main Entry Point for R4: Response Strategy Engine.
 */
export function generateResponseStrategy(params: {
  userQuery: string;
  r1Result: R1IntentResult;
  r2Package: R2ContextPackage;
  r3Decision: R3RoutingDecision;
  deepThinkEnabled?: boolean;
}): R4ResponseStrategy {
  const { userQuery, r1Result, r2Package, r3Decision, deepThinkEnabled } = params;
  const qLower = userQuery.trim().toLowerCase();

  // 1. Determine Depth
  let depth: 'MICRO' | 'SHORT' | 'NORMAL' | 'DETAILED' | 'DEEP' = 'NORMAL';
  if (qLower.length < 15 && /^(what is 2\+2|hi|hello|test|ping|2\+2|\d+[\+\-\*\/]\d+)$/i.test(qLower)) {
    depth = 'MICRO';
  } else if (r1Result.depth === 'DEEP' || /\b(in depth|deeply|comprehensive|exhaustive)\b/i.test(qLower)) {
    depth = 'DEEP';
  } else if (r1Result.intent === 'PLAN' || r1Result.intent === 'ANALYZE' || r1Result.depth === 'DETAILED') {
    depth = 'DETAILED';
  } else if (/\b(brief|short|quick|concise|summary|in 1 sentence|in one sentence)\b/i.test(qLower)) {
    depth = 'SHORT';
  }

  // 2. Determine Format
  let format: ResponseFormat = 'PARAGRAPH';
  if (/\b(bullet|bullets|bullet points|list 5|list 3|list 10)\b/i.test(qLower)) {
    format = 'BULLETS';
  } else if (/\b(step by step|steps|numbered|how to deploy|how to install)\b/i.test(qLower)) {
    format = 'NUMBERED_STEPS';
  } else if (r1Result.intent === 'COMPARE' || /\b(vs|compare|difference|versus)\b/i.test(qLower)) {
    format = 'COMPARISON';
  } else if (r1Result.intent === 'PLAN') {
    format = 'PLAN';
  } else if (r1Result.intent === 'DEBUG') {
    format = 'EXPLANATION_PLUS_CODE';
  } else if (/\b(only code|code only|give me the code|just the code)\b/i.test(qLower)) {
    format = 'CODE';
  } else if (/\b(table|matrix)\b/i.test(qLower)) {
    format = 'TABLE';
  }

  // 3. Determine Tone
  let tone: 'CASUAL' | 'DIRECT' | 'PROFESSIONAL' | 'TEACHING' | 'TECHNICAL' | 'FRIENDLY' | 'FORMAL' = 'DIRECT';
  if (r1Result.intent === 'DEBUG' || format === 'CODE' || format === 'EXPLANATION_PLUS_CODE') {
    tone = 'TECHNICAL';
  } else if (r1Result.intent === 'PLAN' || r1Result.intent === 'ANALYZE') {
    tone = 'PROFESSIONAL';
  } else if (r1Result.intent === 'EXPLAIN') {
    tone = 'TEACHING';
  }

  // 4. Determine Language
  let language = r1Result.language || 'English (Match user style)';
  if (/\bin (hindi|spanish|french|german|japanese|chinese)\b/i.test(qLower)) {
    const langMatch = qLower.match(/\bin (hindi|spanish|french|german|japanese|chinese)\b/i);
    if (langMatch) {
      language = langMatch[1].charAt(0).toUpperCase() + langMatch[1].slice(1);
    }
  }

  // 5. Determine Directness & Actionability
  const directness: 'IMMEDIATE_ANSWER' | 'BALANCED' | 'EXPLORATORY' =
    depth === 'MICRO' || format === 'CODE' || r1Result.intent === 'DEBUG' ? 'IMMEDIATE_ANSWER' : 'BALANCED';

  let actionability: 'NONE' | 'PRACTICAL_STEPS' | 'CODE_ACTIONABLE' | 'DECISION_GUIDANCE' | 'THEORETICAL' = 'THEORETICAL';
  if (format === 'CODE' || format === 'EXPLANATION_PLUS_CODE' || r1Result.intent === 'DEBUG') {
    actionability = 'CODE_ACTIONABLE';
  } else if (format === 'COMPARISON' || r1Result.intent === 'COMPARE' || r1Result.intent === 'DECIDE') {
    actionability = 'DECISION_GUIDANCE';
  } else if (format === 'NUMBERED_STEPS' || format === 'PLAN' || r1Result.intent === 'PLAN') {
    actionability = 'PRACTICAL_STEPS';
  } else if (depth === 'MICRO') {
    actionability = 'NONE';
  }

  // 6. Structure Blueprint
  const structureBlueprint = buildStructureBlueprint(format, r1Result, depth);

  // 7. Task Strategy Directive
  let taskStrategy = '';
  const isFollowUpRequest = r3Decision.evidenceMode === 'CONVERSATION_CONTEXT' || /\b(continue|the (first|second|third|last) option|what about the|make it (shorter|longer|simpler)|revise this)\b/i.test(qLower);

  if (isFollowUpRequest && r2Package.selectedMessages.length > 0) {
    taskStrategy = 'Seamlessly continue, expand, or revise the specific option/topic referenced from previous messages without repeating settled context or starting over.';
  } else {
    switch (r1Result.intent) {
      case 'ASK':
        taskStrategy = 'Provide a direct, authoritative answer without preamble or conversational filler.';
        break;
      case 'EXPLAIN':
        taskStrategy = 'State the core concept immediately, provide intuitive mental model, then illustrate with a clear example.';
        break;
      case 'COMPARE':
        taskStrategy = 'Compare the options side-by-side on concrete criteria (pros, cons, performance, use-cases), ending with a clear decision guide.';
        break;
      case 'SUMMARIZE':
        taskStrategy = 'Extract only key facts and conclusions; eliminate boilerplate, repetition, and minor details.';
        break;
      case 'ANALYZE':
        taskStrategy = 'Examine evidence methodically, detail causal factors, and outline practical implications.';
        break;
      case 'PLAN':
        taskStrategy = 'Lay out concrete chronological steps with dependencies, potential failure points, and clear next actions.';
        break;
      case 'DEBUG':
        taskStrategy = 'State root cause first, provide clean bug-free code, and explain exactly why the fix works.';
        break;
      case 'REWRITE':
        taskStrategy = 'Preserve exact semantic intent while elevating clarity, tone, and readability to the requested style.';
        break;
      case 'BRAINSTORM':
        taskStrategy = 'Provide diverse, non-obvious, actionable ideas categorized logically with distinct value propositions.';
        break;
      case 'DECIDE':
        taskStrategy = 'Recommend the strongest option upfront with clear justification, then present viable alternatives.';
        break;
      case 'CREATE':
        taskStrategy = 'Deliver the complete requested asset/code directly with production-grade craft and zero placeholder stubs.';
        break;
      case 'CLARIFY':
        taskStrategy = 'Ask a single concise clarifying question focusing on the missing variable.';
        break;
      default:
        taskStrategy = 'Fulfill the user request directly and accurately with proportional detail.';
    }
  }

  // Summary Text for system prompt insertion
  const summaryParts: string[] = [];
  summaryParts.push('NEXORBIT R4 RESPONSE STRATEGY DIRECTIVES:');
  summaryParts.push(`- TARGET DEPTH: ${depth}`);
  summaryParts.push(`- TARGET FORMAT: ${format}`);
  summaryParts.push(`- TARGET TONE: ${tone}`);
  summaryParts.push(`- RESPONSE LANGUAGE: ${language}`);
  summaryParts.push(`- DIRECTNESS LEVEL: ${directness}`);
  summaryParts.push(`- ACTIONABILITY: ${actionability}`);
  summaryParts.push(`- CORE TASK STRATEGY: ${taskStrategy}`);
  summaryParts.push(`- STRUCTURE BLUEPRINT:\n  ${structureBlueprint.join('\n  ')}`);

  if (r1Result.constraints && r1Result.constraints.length > 0) {
    summaryParts.push(`- USER CONSTRAINTS TO RESPECT: ${r1Result.constraints.join('; ')}`);
  }

  return {
    depth,
    format,
    tone,
    language,
    directness,
    actionability,
    structureBlueprint,
    strategySummaryText: summaryParts.join('\n')
  };
}
