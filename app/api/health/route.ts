import { NextResponse } from 'next/server';
import { Nexorbit_CONFIG } from '@/config';

export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    app: Nexorbit_CONFIG.appName,
    tagline: Nexorbit_CONFIG.tagline,
    version: Nexorbit_CONFIG.version,
    environment: Nexorbit_CONFIG.env,
    architecture: {
      userIsolation: 'ACTIVE',
      firestoreSecurityRules: 'CONFIGURED',
      creditSystem: 'SERVER_AUTHORITATIVE',
      subscriptionTier: 'FREE_AND_PRO',
      aiGateway: 'MODEL_ROUTING_ACTIVE',
      personalBrain: 'CONTEXT_ENGINE_ACTIVE',
      connectorAbstraction: 'UNIFIED_INTERFACE',
      actionLifecycle: 'PREPARE_TO_COMPLETE_STAGES',
    },
    timestamp: new Date().toISOString(),
  });
}
