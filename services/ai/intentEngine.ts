export interface R1IntentResult {
  intent: string;
  secondaryIntent?: string;
  goal: string;
  depth: 'MICRO' | 'SHORT' | 'NORMAL' | 'DETAILED' | 'DEEP';
  requestedFormat?: string;
  language?: string;
  style?: string;
  constraints: string[];
  ambiguity: 'CLEAR' | 'UNCLEAR';
  imageIntent: boolean;
  webSearchIntent: boolean;
  fileIntent: boolean;
  connectorIntent: boolean;
}

export function extractIntentAndGoal(lastUserMessage: string, messages: any[], hasAttachments: boolean): R1IntentResult {
  const text = (lastUserMessage || '').trim();
  const lowerText = text.toLowerCase();
  
  let intent = 'ASK';
  let secondaryIntent: string | undefined = undefined;
  let ambiguity: 'CLEAR' | 'UNCLEAR' = 'CLEAR';
  let depth: 'MICRO' | 'SHORT' | 'NORMAL' | 'DETAILED' | 'DEEP' = 'NORMAL';
  let requestedFormat: string | undefined = undefined;
  let language: string | undefined = undefined;
  let style: string | undefined = undefined;
  const constraints: string[] = [];

  // 1. Ambiguity Detection (Strictly for solitary ungrounded words)
  const isSolitaryVagueWord = /^(fix|help|debug|explain|fix this|do this|why|help me|what)\s*(\!|\?|\.)*$/i.test(text.trim());
  if (isSolitaryVagueWord && !hasAttachments && messages.length <= 1) {
    ambiguity = 'UNCLEAR';
    intent = 'CLARIFY';
  }

  // 2. Intent Detection
  const isDebug = /\b(debug|fix|error|failing|fails|exception|stacktrace|bug|broken)\b/.test(lowerText);
  const isCompare = /\b(compare|difference|vs|versus|better|which is better|which one)\b/.test(lowerText);
  const isSummarize = /\b(summarize|tl;?dr|summary|abstract|in short)\b/.test(lowerText);
  const isExplain = /^(explain|describe|tell me about|what is|what are)\b|\b(explain|what does .* mean)\b/.test(lowerText);
  const isBrainstorm = /\b(brainstorm|ideas|suggest|options|give me .* ideas|give me .* options)\b/.test(lowerText);
  const isPlan = /\b(plan|roadmap|strategy|schedule|step-by-step guide to|how to build a|how to plan|make a .* plan)\b/.test(lowerText);
  const isRewrite = /\b(rewrite|rephrase|refactor|improve this text|make it sound|proofread)\b/.test(lowerText);
  const isCreate = /\b(create|generate|make|draw|produce|write a|build a)\b/.test(lowerText);
  const isDecide = /\b(decide|choose|which one should i|recommend|which api)\b/.test(lowerText);
  const isAnalyze = /\b(analyze|evaluate|review|assess|what do you think of)\b/.test(lowerText);

  const intentsFound: string[] = [];
  
  if (isDebug) intentsFound.push('DEBUG');
  if (isCompare) intentsFound.push('COMPARE');
  if (isDecide) intentsFound.push('DECIDE');
  if (isSummarize) intentsFound.push('SUMMARIZE');
  if (isBrainstorm) intentsFound.push('BRAINSTORM');
  if (isPlan) intentsFound.push('PLAN');
  if (isRewrite) intentsFound.push('REWRITE');
  if (isAnalyze) intentsFound.push('ANALYZE');
  if (isExplain) intentsFound.push('EXPLAIN');
  if (isCreate) intentsFound.push('CREATE');

  if (ambiguity !== 'UNCLEAR') {
    if (intentsFound.length > 0) {
      intent = intentsFound[0];
      if (intentsFound.length > 1) {
        secondaryIntent = intentsFound[1];
      }
    } else if (/^(what|who|where|when|why|how)\b/.test(lowerText) || /\?$/.test(lowerText)) {
      intent = 'ASK';
    } else {
      intent = 'OTHER';
    }
  }

  // 3. Goal Extraction
  let goal = text;
  if (goal.length > 100) {
     goal = goal.substring(0, 100) + '...';
  }
  
  if (intent === 'DECIDE' && isCompare) {
     goal = "Compare options and recommend the best one for the user's needs.";
  } else if (intent === 'DEBUG') {
     goal = "Identify and resolve the error or issue in the provided context.";
  } else if (intent === 'SUMMARIZE') {
     goal = "Provide a concise summary of the provided text or topic.";
  } else if (intent === 'CLARIFY') {
     goal = "Request missing context or information from the user.";
  } else {
     goal = `Address the user's request: "${goal}"`;
  }

  // 4. Output Requirement Extraction
  if (/\b(table)\b/.test(lowerText)) requestedFormat = 'table';
  else if (/\b(bullets|bullet points)\b/.test(lowerText)) requestedFormat = 'bullets';
  else if (/\b(code|script|only the code|just the code|give me the code)\b/.test(lowerText)) requestedFormat = 'code';
  else if (/\b(step[- ]by[- ]step|numbered steps)\b/.test(lowerText)) requestedFormat = 'numbered_steps';
  else if (/\b(example)\b/.test(lowerText)) requestedFormat = 'example';
  
  // Language & Style
  const langMatch = lowerText.match(/\b(in hindi|in english|in spanish|in french|in german|in japanese|in chinese|in korean)\b/);
  if (langMatch) {
    language = langMatch[1].replace('in ', '').trim();
    language = language.charAt(0).toUpperCase() + language.slice(1);
  }
  
  if (/\b(beginner[- ]friendly|simple|like i'm 5|eli5)\b/.test(lowerText)) style = 'beginner-friendly';
  else if (/\b(technical|advanced|expert)\b/.test(lowerText)) style = 'technical';
  else if (/\b(casual|informal|friendly)\b/.test(lowerText)) style = 'casual';
  else if (/\b(professional|formal|business)\b/.test(lowerText)) style = 'professional';

  // 5. Depth / Effort Signal
  if (/\b(deep|deeply|in depth|comprehensive|extensive|exhaustive)\b/.test(lowerText)) {
    depth = 'DEEP';
  } else if (/\b(complete|detailed|full breakdown)\b/.test(lowerText)) {
    depth = 'DETAILED';
  } else if (/\b(short|concise|brief|quick|just tell me|tldr|in a few words)\b/.test(lowerText)) {
    depth = 'SHORT';
  } else if (/\b(one word|yes or no|micro)\b/.test(lowerText)) {
    depth = 'MICRO';
  } else if (requestedFormat === 'detailed') {
    depth = 'DETAILED';
  }

  // 6. Constraints
  const itemMatch = lowerText.match(/\b(\d+)\s+(words|sentences|paragraphs|items|ideas|options|reasons|points|tips|benefits)\b/);
  if (itemMatch) {
    constraints.push(`Limit output to ${itemMatch[1]} ${itemMatch[2]}`);
  }
  
  if (/\b(no explanation|without explanation|just code|only code)\b/.test(lowerText)) {
    constraints.push('Do not include explanatory text');
  }
  if (/\b(don'?t use (a )?table)\b/.test(lowerText)) {
    constraints.push('Do not use a table');
  }
  if (/\b(don'?t search|without searching)\b/.test(lowerText)) {
    constraints.push('Do not use web search');
  }
  
  // 7. Signals
  const imageIntent = /\b(create|generate|make|draw|paint|render|illustrate)\b.*?\b(image|picture|photo|illustration|artwork|diagram|drawing)\b/.test(lowerText);
  const webSearchIntent = /\b(search the web|google|look up online|latest news on|search .* online)\b/.test(lowerText);
  const fileIntent = /\b(analyze this pdf|read this file|extract from document|summarize this pdf|summarize document)\b/.test(lowerText) || hasAttachments;
  const connectorIntent = /\b(check my gmail|read my emails|look in drive|calendar|github issue)\b/.test(lowerText);

  return {
    intent,
    secondaryIntent,
    goal,
    depth,
    requestedFormat,
    language,
    style,
    constraints,
    ambiguity,
    imageIntent,
    webSearchIntent,
    fileIntent,
    connectorIntent
  };
}
