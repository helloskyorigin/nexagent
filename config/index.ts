export const Nexorbit_CONFIG = {
  appName: 'Nexorbit',
  tagline: 'Your AI Brain for the Digital World.',
  version: '1.0.0-phase1',
  
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV === 'development',
  
  // V1 Tier Specifications
  plans: {
    FREE: {
      id: 'FREE',
      name: 'Free',
      monthlyCredits: 500,
      priceINR: 0,
    },
    PRO: {
      id: 'PRO',
      name: 'Pro',
      monthlyCredits: 15000,
      priceINR: 1499,
      targetPriceFormatted: '₹1,499/month',
    },
  },

  // V1 Add-on Credit Pack
  creditPack: {
    credits: 5000,
    priceINR: 499,
    formatted: '5,000 credits for ₹499',
  },

  // Operations and Cost Map in Credits
  creditCosts: {
    ASK_MY_WORLD: 5,
    CONNECT_THE_DOTS: 10,
    WHAT_CHANGED: 8,
    CLEAN_MY_DAY: 15,
    ONE_TAP_ACTION: 10,
    DEEP_RESEARCH: 25,
    VOICE: 15,
    AUDIO_BRIEFING: 20,
    IMAGE_GENERATION: 30,
    DOCUMENT_ANALYSIS: 15,
    HEAVY_AGENT_TASK: 50,
  } as Record<string, number>,

  // Allowed V1 Connectors
  connectors: ['GMAIL', 'GOOGLE_CALENDAR', 'GOOGLE_DRIVE', 'NOTION', 'GITHUB'] as const,

  // AI Gateway Configuration
  ai: {
    defaultModel: 'gemini-2.5-flash',
    heavyReasoningModel: 'gemini-2.5-pro',
    visionModel: 'gemini-2.5-flash',
    embeddingModel: 'text-embedding-004',
  },
} as const;

export type PlanType = 'FREE' | 'PRO';
export type OperationType = keyof typeof Nexorbit_CONFIG.creditCosts;
export type SupportedConnectorType = typeof Nexorbit_CONFIG.connectors[number];
