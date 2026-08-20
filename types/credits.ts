import { OperationType } from '../config';
import { CreditBalance, CreditUsage } from './models';

export interface ICreditService {
  checkCredits(userId: string, operation: OperationType): Promise<{
    hasCredits: boolean;
    required: number;
    available: number;
  }>;

  consumeCredits(
    userId: string,
    operation: OperationType,
    metadata?: Record<string, unknown>
  ): Promise<{
    success: boolean;
    consumed: number;
    remainingBalance: number;
    usageRecord: CreditUsage;
  }>;

  refundCredits(
    userId: string,
    usageId: string,
    reason: string
  ): Promise<{
    success: boolean;
    refundedAmount: number;
    newBalance: number;
  }>;

  recordUsage(
    userId: string,
    operation: OperationType,
    amount: number,
    metadata?: Record<string, unknown>
  ): Promise<CreditUsage>;

  resetMonthlyCredits(userId: string, monthlyAllowance: number): Promise<CreditBalance>;

  getCreditBalance(userId: string): Promise<CreditBalance>;
}
