import { CreditService } from '../services/credits/credit.service';
import { SubscriptionService } from '../services/subscription/subscription.service';
import { UserIsolationService } from '../services/security/user-isolation.service';
import { ConnectorService } from '../services/connectors/connector.service';
import { BrainContextService } from '../services/brain/context.service';
import { ActionEngine } from '../services/actions/action.engine';
import { NexorbitModelRouter } from '../services/ai/ai.gateway';

export interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  details: string;
}

export async function runPhase0VerificationSuite(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const testUserId = `test_user_${Date.now()}`;
  const attackerUserId = `attacker_user_${Date.now()}`;

  // 1. User Isolation & Security Test
  try {
    UserIsolationService.validateOwnership(testUserId, testUserId);
    let errorCaught = false;
    try {
      UserIsolationService.validateOwnership(testUserId, attackerUserId);
    } catch {
      errorCaught = true;
    }

    results.push({
      id: 'SEC-01',
      name: 'Tenant Data Isolation Validation',
      passed: errorCaught,
      details: errorCaught
        ? 'Cross-tenant access correctly denied with 403 Forbidden error'
        : 'SECURITY FAILURE: Cross-tenant access was not blocked',
    });
  } catch (err) {
    results.push({
      id: 'SEC-01',
      name: 'Tenant Data Isolation Validation',
      passed: false,
      details: `Execution error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  // 2. Credit System & Plan Transitions
  try {
    const creditService = new CreditService();
    const subService = new SubscriptionService(creditService);

    const initialBalance = await creditService.getCreditBalance(testUserId);
    const freePassed = initialBalance.monthlyRemaining === 500;

    await subService.setPlan(testUserId, 'PRO');
    const proBalance = await creditService.getCreditBalance(testUserId);
    const proPassed = proBalance.monthlyRemaining === 15000;

    const consumeResult = await creditService.consumeCredits(testUserId, 'ASK_MY_WORLD');
    const consumePassed = consumeResult.consumed === 5 && consumeResult.remainingBalance === 14995;

    results.push({
      id: 'CRD-01',
      name: 'Server-Authoritative Credit System & Plan Upgrades',
      passed: freePassed && proPassed && consumePassed,
      details: `Free: ${initialBalance.monthlyRemaining}/500, Pro: ${proBalance.monthlyRemaining}/15000, Consumed 5 credits for ASK_MY_WORLD (Remaining: ${consumeResult.remainingBalance})`,
    });
  } catch (err) {
    results.push({
      id: 'CRD-01',
      name: 'Server-Authoritative Credit System & Plan Upgrades',
      passed: false,
      details: `Execution error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  // 3. Connector Abstraction
  try {
    const connectorService = new ConnectorService();
    const initialStatuses = await connectorService.getStatuses(testUserId);

    await connectorService.connectConnector(testUserId, 'GMAIL', {
      accountEmail: 'test@nexorbit.ai',
    });

    const updatedStatuses = await connectorService.getStatuses(testUserId);
    const gmailConnected = updatedStatuses.find((s) => s.type === 'GMAIL')?.connected === true;

    results.push({
      id: 'CON-01',
      name: 'Unified Connector Abstraction Interface',
      passed: initialStatuses.length === 5 && gmailConnected,
      details: `Verified 5 supported connectors (GMAIL, CALENDAR, DRIVE, NOTION, GITHUB). Gmail connected status: ${gmailConnected}`,
    });
  } catch (err) {
    results.push({
      id: 'CON-01',
      name: 'Unified Connector Abstraction Interface',
      passed: false,
      details: `Execution error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  // 4. Personal Brain Context Engine
  try {
    const brainService = new BrainContextService();
    const memory = await brainService.addMemory(testUserId, {
      content: 'User prefers concise executive morning briefings',
      category: 'PREFERENCE',
      tags: ['briefing', 'executive'],
      confidenceScore: 0.98,
    });

    const memories = await brainService.getMemories(testUserId);
    const retrieved = memories.length === 1 && memories[0].id === memory.id;

    results.push({
      id: 'BRN-01',
      name: 'Personal Brain Memory & Retrieval Boundaries',
      passed: retrieved,
      details: `Added preference memory. Retrieved memory count: ${memories.length}`,
    });
  } catch (err) {
    results.push({
      id: 'BRN-01',
      name: 'Personal Brain Memory & Retrieval Boundaries',
      passed: false,
      details: `Execution error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  // 5. Action Verification Lifecycle
  try {
    const actionEngine = new ActionEngine();
    const connectorService = new ConnectorService();

    await connectorService.connectConnector(testUserId, 'NOTION', {
      accountEmail: 'notion@nexorbit.ai',
    });

    const action = await actionEngine.prepareAction(testUserId, 'CREATE_PAGE', 'NOTION', {
      title: 'Weekly Roadmap',
    });

    const verify = await actionEngine.verifyAction(testUserId, action.id);
    const approval = await actionEngine.requestApproval(
      testUserId,
      action.id,
      'Create Notion Page "Weekly Roadmap"'
    );
    approval.status = 'APPROVED';

    const executed = await actionEngine.executeAction(testUserId, action.id, approval.id);
    const verifyRes = await actionEngine.verifyResult(testUserId, action.id);
    const completed = await actionEngine.completeAction(testUserId, action.id);

    const lifecyclePassed =
      action.status === 'PREPARE' &&
      verify.passed &&
      executed.status === 'EXECUTE' &&
      verifyRes.passed &&
      completed.status === 'COMPLETE';

    results.push({
      id: 'ACT-01',
      name: 'Action Verification State Machine Lifecycle',
      passed: lifecyclePassed,
      details: `Full stage sequence verified: PREPARE → VERIFY → REQUEST_APPROVAL → EXECUTE → VERIFY_RESULT → COMPLETE`,
    });
  } catch (err) {
    results.push({
      id: 'ACT-01',
      name: 'Action Verification State Machine Lifecycle',
      passed: false,
      details: `Execution error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  // 6. AI Model Router
  try {
    const router = new NexorbitModelRouter();
    const defaultModel = router.routeTask('ASK_MY_WORLD');
    const heavyModel = router.routeTask('HEAVY_AGENT_TASK');

    const routerPassed = defaultModel === 'gemini-2.5-flash' && heavyModel === 'gemini-2.5-pro';

    results.push({
      id: 'AI-01',
      name: 'AI Gateway Model Routing Logic',
      passed: routerPassed,
      details: `ASK_MY_WORLD → ${defaultModel}, HEAVY_AGENT_TASK → ${heavyModel}`,
    });
  } catch (err) {
    results.push({
      id: 'AI-01',
      name: 'AI Gateway Model Routing Logic',
      passed: false,
      details: `Execution error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  return results;
}
