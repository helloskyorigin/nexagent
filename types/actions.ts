import { Action, ActionApproval, Evidence } from './models';

export type ActionLifecycleStage =
  | 'PREPARE'
  | 'VERIFY'
  | 'REQUEST_APPROVAL'
  | 'EXECUTE'
  | 'VERIFY_RESULT'
  | 'COMPLETE'
  | 'FAILED';

export interface VerificationResult {
  passed: boolean;
  stage: ActionLifecycleStage;
  checks: Array<{
    name: string;
    passed: boolean;
    details?: string;
  }>;
  evidence?: Evidence[];
}

export interface IActionEngine {
  prepareAction(
    userId: string,
    actionType: string,
    targetConnector: Action['targetConnector'],
    payload: Record<string, unknown>
  ): Promise<Action>;

  verifyAction(userId: string, actionId: string): Promise<VerificationResult>;

  requestApproval(userId: string, actionId: string, summary: string): Promise<ActionApproval>;

  executeAction(userId: string, actionId: string, approvalId: string): Promise<Action>;

  verifyResult(userId: string, actionId: string): Promise<VerificationResult>;

  completeAction(userId: string, actionId: string): Promise<Action>;
}
