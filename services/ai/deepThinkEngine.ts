import { R1IntentResult } from './intentEngine';
import { R2ContextPackage } from './contextBrain';
import { R3RoutingDecision } from './evidenceRouter';
import { R4ResponseStrategy } from './responseStrategy';

export interface DeepThinkInputParams {
  userQuery: string;
  r1Result: R1IntentResult;
  r2Package: R2ContextPackage;
  r3Decision: R3RoutingDecision;
  r4Strategy: R4ResponseStrategy;
  deepThinkEnabled?: boolean;
}

export type ComplexityCategory =
  | 'TRIVIAL'
  | 'MODERATE'
  | 'COMPLEX_TECHNICAL'
  | 'COMPLEX_STRATEGIC'
  | 'COMPLEX_RESEARCH';

export interface DeepThinkPolicyResult {
  deepThinkActive: boolean;
  effortLevel: 'NORMAL' | 'HIGH';
  complexityCategory: ComplexityCategory;
  analysisDirectives: string[];
  systemPromptAddendum: string;
}

/**
 * Assesses whether query is trivial/simple vs complex.
 */
function evaluateComplexity(
  userQuery: string,
  r1Result: R1IntentResult,
  r2Package: R2ContextPackage,
  r3Decision: R3RoutingDecision
): ComplexityCategory {
  const qLower = userQuery.trim().toLowerCase();

  // 1. Trivial queries (math, greetings, simple single-fact queries)
  if (
    /^(2\+2|what is 2\+2|hi|hello|hey|ping|test|thanks|thank you|who are you|what is your name)(\s*|\!|\.|\?)*$/i.test(qLower) ||
    (qLower.length < 20 && !/(why|how|explain|compare|debug|fix|code|build|analyze|plan)/i.test(qLower))
  ) {
    return 'TRIVIAL';
  }

  // 2. Technical / Code / Architecture
  if (
    r1Result.intent === 'DEBUG' ||
    r1Result.intent === 'CREATE' ||
    r3Decision.primarySources.includes('FILE') ||
    /(code|bug|error|refactor|architecture|system design|database|typecheck|function|class|api|endpoint|stack trace|algorithm|memory leak|performance)/i.test(qLower)
  ) {
    return 'COMPLEX_TECHNICAL';
  }

  // 3. Strategic / Comparative / Planning
  if (
    r1Result.intent === 'PLAN' ||
    r1Result.intent === 'COMPARE' ||
    r1Result.intent === 'DECIDE' ||
    /(strategy|startup|tradeoff|versus|recommendation|pros and cons|monetization|roadmap|growth|launch plan)/i.test(qLower)
  ) {
    return 'COMPLEX_STRATEGIC';
  }

  // 4. Research / Multi-source
  if (
    r3Decision.evidenceMode === 'WEB' ||
    r3Decision.evidenceMode === 'MULTI_SOURCE' ||
    r1Result.intent === 'ANALYZE' ||
    /(research|investigate|latest data|benchmark|literature|whitepaper|market analysis)/i.test(qLower)
  ) {
    return 'COMPLEX_RESEARCH';
  }

  return 'MODERATE';
}

/**
 * R5 Deep Think Engine: Formulates effort policy & internal analysis directives.
 */
export function evaluateDeepThinkPolicy(params: DeepThinkInputParams): DeepThinkPolicyResult {
  const { userQuery, r1Result, r2Package, r3Decision, r4Strategy, deepThinkEnabled } = params;

  if (!deepThinkEnabled) {
    return {
      deepThinkActive: false,
      effortLevel: 'NORMAL',
      complexityCategory: 'MODERATE',
      analysisDirectives: [],
      systemPromptAddendum: ''
    };
  }

  const complexityCategory = evaluateComplexity(userQuery, r1Result, r2Package, r3Decision);

  const analysisDirectives: string[] = [];

  if (complexityCategory === 'TRIVIAL') {
    analysisDirectives.push('EFFORT BOUND: This query is simple/trivial. Maintain high accuracy but do NOT produce an artificially long response, filler essay, or unrequested elaboration.');
    analysisDirectives.push('DELIVERY: Provide the direct, concise answer immediately.');
  } else {
    analysisDirectives.push('DEEP ANALYSIS REQUIRED: Engage high-effort reasoning to carefully decompose the request, inspect user goals, and verify assumptions before generating the final answer.');
    analysisDirectives.push('CONTEXT & EVIDENCE AUDIT: Thoroughly evaluate relevant conversation history, attached files, and retrieved evidence. Cross-check facts and eliminate contradictions.');
    analysisDirectives.push('TASK DECOMPOSITION: Break down multi-layered technical, strategic, or logical requirements internally to ensure every sub-component is rigorously addressed.');
    analysisDirectives.push('CONCISE QUALITY OVER WORD COUNT: Deep Think means deeper, more careful thinking — NOT longer text. Be clear, accurate, authoritative, and eliminate fluff.');
  }

  // Format & Length Constraint Enforcement
  if (r4Strategy.format === 'BULLETS' || r4Strategy.format === 'NUMBERED_STEPS' || r4Strategy.format === 'CODE' || r4Strategy.format === 'TABLE') {
    analysisDirectives.push(`CONSTRAINT ENFORCEMENT: Strictly adhere to the requested output format (${r4Strategy.format}). Deep Think analysis must refine the quality inside the constraints, never violate them.`);
  }

  // Strict Privacy Directive
  analysisDirectives.push('STRICT PRIVACY GUARANTEE: Never reveal or print hidden internal chain-of-thought, reasoning steps, private analysis tags, or scratchpad text. Present only the final, polished response.');

  const systemParts: string[] = [];
  systemParts.push('\n\n🪐 NEXORBIT R5 DEEP THINK MODE ACTIVE (HIGH-EFFORT ANALYSIS POLICY):');
  systemParts.push(`- MODE STATUS: Deep Think ON (Effort Level: HIGH)`);
  systemParts.push(`- TASK COMPLEXITY CATEGORY: ${complexityCategory}`);
  systemParts.push('- EFFORT DIRECTIVES:');
  analysisDirectives.forEach((d) => systemParts.push(`  * ${d}`));

  return {
    deepThinkActive: true,
    effortLevel: 'HIGH',
    complexityCategory,
    analysisDirectives,
    systemPromptAddendum: systemParts.join('\n')
  };
}
