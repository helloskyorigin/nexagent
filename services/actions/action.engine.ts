import { Action, ActionApproval } from '../../types/models';
import { IActionEngine, VerificationResult } from '../../types/actions';
import { inMemoryStore } from '../../lib/firebase';
import { ErrorCode, NexorbitError } from '../../types/errors';
import { logger } from '../../lib/logger';
import { UserIsolationService } from '../security/user-isolation.service';

export class ActionEngine implements IActionEngine {
  async prepareAction(
    userId: string,
    actionType: string,
    targetConnector: Action['targetConnector'],
    payload: Record<string, unknown>
  ): Promise<Action> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const actionId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const action: Action = {
      id: actionId,
      userId: validUserId,
      type: actionType,
      targetConnector,
      payload,
      status: 'PREPARE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc('actions', actionId, action as unknown as Record<string, unknown>);

    logger.info(`Action prepared: ${actionType}`, {
      userId: validUserId,
      operation: 'prepareAction',
      status: 'SUCCESS',
      actionId,
    });

    return action;
  }

  async verifyAction(userId: string, actionId: string): Promise<VerificationResult> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const action = inMemoryStore.getDoc('actions', actionId) as Action | null;

    if (!action) {
      throw new NexorbitError(ErrorCode.NOT_FOUND, `Action ${actionId} not found`);
    }

    UserIsolationService.validateOwnership(action.userId, validUserId);

    const connectorDoc = inMemoryStore.getDoc(
      'connectors',
      `connector_${validUserId}_${action.targetConnector}`
    );

    const hasConnector = Boolean(connectorDoc);

    const verification: VerificationResult = {
      passed: hasConnector,
      stage: 'VERIFY',
      checks: [
        {
          name: 'Target Connector Authorization',
          passed: hasConnector,
          details: hasConnector ? 'Connector authorization active' : 'Connector disconnected or unlinked',
        },
        {
          name: 'Payload Schema Sanity',
          passed: Boolean(action.payload && typeof action.payload === 'object'),
        },
      ],
    };

    const newStatus = verification.passed ? 'VERIFY' : 'FAILED';
    inMemoryStore.setDoc('actions', actionId, {
      ...action,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    return verification;
  }

  async requestApproval(
    userId: string,
    actionId: string,
    summary: string
  ): Promise<ActionApproval> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const action = inMemoryStore.getDoc('actions', actionId) as Action | null;

    if (!action) {
      throw new NexorbitError(ErrorCode.NOT_FOUND, `Action ${actionId} not found`);
    }

    UserIsolationService.validateOwnership(action.userId, validUserId);

    const approvalId = `appr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const approval: ActionApproval = {
      id: approvalId,
      actionId,
      userId: validUserId,
      summary,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc('actionApprovals', approvalId, approval as unknown as Record<string, unknown>);

    inMemoryStore.setDoc('actions', actionId, {
      ...action,
      status: 'REQUEST_APPROVAL',
      approvalId,
      updatedAt: new Date().toISOString(),
    });

    return approval;
  }

  async executeAction(
    userId: string,
    actionId: string,
    approvalId: string
  ): Promise<Action> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const action = inMemoryStore.getDoc('actions', actionId) as Action | null;

    if (!action) {
      throw new NexorbitError(ErrorCode.NOT_FOUND, `Action ${actionId} not found`);
    }

    UserIsolationService.validateOwnership(action.userId, validUserId);

    const approval = inMemoryStore.getDoc('actionApprovals', approvalId) as ActionApproval | null;
    if (!approval || approval.status !== 'APPROVED') {
      throw new NexorbitError(
        ErrorCode.FORBIDDEN,
        'Cannot execute action without approved ActionApproval token'
      );
    }

    const executedAction: Action = {
      ...action,
      status: 'EXECUTE',
      result: {
        executedAt: new Date().toISOString(),
        outcome: 'MOCK_EXECUTION_SUCCESSFUL',
      },
      updatedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc('actions', actionId, executedAction as unknown as Record<string, unknown>);
    return executedAction;
  }

  async verifyResult(userId: string, actionId: string): Promise<VerificationResult> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const action = inMemoryStore.getDoc('actions', actionId) as Action | null;

    if (!action) {
      throw new NexorbitError(ErrorCode.NOT_FOUND, `Action ${actionId} not found`);
    }

    UserIsolationService.validateOwnership(action.userId, validUserId);

    const resultPassed = Boolean(action.result);

    const verification: VerificationResult = {
      passed: resultPassed,
      stage: 'VERIFY_RESULT',
      checks: [
        {
          name: 'Execution Confirmation Check',
          passed: resultPassed,
          details: resultPassed ? 'Action output verified successfully' : 'No execution output found',
        },
      ],
    };

    inMemoryStore.setDoc('actions', actionId, {
      ...action,
      status: resultPassed ? 'VERIFY_RESULT' : 'FAILED',
      updatedAt: new Date().toISOString(),
    });

    return verification;
  }

  async completeAction(userId: string, actionId: string): Promise<Action> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const action = inMemoryStore.getDoc('actions', actionId) as Action | null;

    if (!action) {
      throw new NexorbitError(ErrorCode.NOT_FOUND, `Action ${actionId} not found`);
    }

    UserIsolationService.validateOwnership(action.userId, validUserId);

    const completedAction: Action = {
      ...action,
      status: 'COMPLETE',
      updatedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc('actions', actionId, completedAction as unknown as Record<string, unknown>);

    logger.info(`Action complete: ${action.id}`, {
      userId: validUserId,
      operation: 'completeAction',
      status: 'SUCCESS',
      actionId,
    });

    return completedAction;
  }
}
