import { Nexorbit_CONFIG, OperationType } from '../../config';
import { inMemoryStore } from '../../lib/firebase';
import { CreditBalance, CreditUsage } from '../../types/models';
import { ICreditService } from '../../types/credits';
import { ErrorCode, NexorbitError } from '../../types/errors';
import { logger } from '../../lib/logger';
import { UserIsolationService } from '../security/user-isolation.service';

export class CreditService implements ICreditService {
  private readonly collectionName = 'creditBalances';
  private readonly usageCollectionName = 'creditUsages';

  public async getCreditBalance(userId: string): Promise<CreditBalance> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const existing = inMemoryStore.getDoc(this.collectionName, validUserId) as CreditBalance | null;

    if (existing) {
      return existing;
    }

    // Default to FREE tier allowance (500 credits) on initial creation
    const initialBalance: CreditBalance = {
      userId: validUserId,
      monthlyAllowance: Nexorbit_CONFIG.plans.FREE.monthlyCredits,
      monthlyRemaining: Nexorbit_CONFIG.plans.FREE.monthlyCredits,
      addonCredits: 0,
      lastResetAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc(this.collectionName, validUserId, initialBalance as unknown as Record<string, unknown>);
    return initialBalance;
  }

  public async checkCredits(
    userId: string,
    operation: OperationType
  ): Promise<{ hasCredits: boolean; required: number; available: number }> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const required = Nexorbit_CONFIG.creditCosts[operation];

    if (typeof required !== 'number') {
      throw new NexorbitError(
        ErrorCode.VALIDATION_ERROR,
        `Unknown operation type for credit calculation: ${operation}`
      );
    }

    const balance = await this.getCreditBalance(validUserId);
    const available = balance.monthlyRemaining + balance.addonCredits;

    return {
      hasCredits: available >= required,
      required,
      available,
    };
  }

  public async consumeCredits(
    userId: string,
    operation: OperationType,
    metadata?: Record<string, unknown>
  ): Promise<{
    success: boolean;
    consumed: number;
    remainingBalance: number;
    usageRecord: CreditUsage;
  }> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const check = await this.checkCredits(validUserId, operation);

    if (!check.hasCredits) {
      logger.warn('Insufficient credits for operation', {
        userId: validUserId,
        operation,
        status: 'ERROR',
        required: check.required,
        available: check.available,
      });

      throw new NexorbitError(
        ErrorCode.INSUFFICIENT_CREDITS,
        `Insufficient credits. Required: ${check.required}, Available: ${check.available}. Upgrade to Pro for 15,000 monthly credits.`,
        402
      );
    }

    const balance = await this.getCreditBalance(validUserId);
    const totalBefore = balance.monthlyRemaining + balance.addonCredits;
    let required = check.required;

    let newMonthly = balance.monthlyRemaining;
    let newAddon = balance.addonCredits;

    // First deduct from monthly allowance, then from add-on pack credits
    if (newMonthly >= required) {
      newMonthly -= required;
    } else {
      required -= newMonthly;
      newMonthly = 0;
      newAddon -= required;
    }

    const totalAfter = newMonthly + newAddon;

    const updatedBalance: CreditBalance = {
      ...balance,
      monthlyRemaining: newMonthly,
      addonCredits: newAddon,
      updatedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc(this.collectionName, validUserId, updatedBalance as unknown as Record<string, unknown>);

    const usageRecord = await this.recordUsage(
      validUserId,
      operation,
      check.required,
      metadata
    );

    logger.info(`Credits consumed for ${operation}`, {
      userId: validUserId,
      operation,
      status: 'SUCCESS',
      consumed: check.required,
      balanceBefore: totalBefore,
      balanceAfter: totalAfter,
    });

    return {
      success: true,
      consumed: check.required,
      remainingBalance: totalAfter,
      usageRecord,
    };
  }

  public async refundCredits(
    userId: string,
    usageId: string,
    reason: string
  ): Promise<{ success: boolean; refundedAmount: number; newBalance: number }> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const usage = inMemoryStore.getDoc(this.usageCollectionName, usageId) as CreditUsage | null;

    if (!usage) {
      throw new NexorbitError(ErrorCode.NOT_FOUND, `Usage record ${usageId} not found`);
    }

    UserIsolationService.validateOwnership(usage.userId, validUserId);

    const balance = await this.getCreditBalance(validUserId);
    const updatedBalance: CreditBalance = {
      ...balance,
      monthlyRemaining: balance.monthlyRemaining + usage.cost,
      updatedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc(this.collectionName, validUserId, updatedBalance as unknown as Record<string, unknown>);

    logger.info(`Credits refunded for usage ${usageId}`, {
      userId: validUserId,
      operation: 'refundCredits',
      status: 'SUCCESS',
      refundedAmount: usage.cost,
      reason,
    });

    return {
      success: true,
      refundedAmount: usage.cost,
      newBalance: updatedBalance.monthlyRemaining + updatedBalance.addonCredits,
    };
  }

  public async recordUsage(
    userId: string,
    operation: OperationType,
    amount: number,
    metadata?: Record<string, unknown>
  ): Promise<CreditUsage> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const balance = await this.getCreditBalance(validUserId);
    const currentTotal = balance.monthlyRemaining + balance.addonCredits;

    const usageId = `usage_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const usageRecord: CreditUsage = {
      id: usageId,
      userId: validUserId,
      operation,
      cost: amount,
      balanceBefore: currentTotal + amount,
      balanceAfter: currentTotal,
      metadata,
      timestamp: new Date().toISOString(),
    };

    inMemoryStore.setDoc(
      this.usageCollectionName,
      usageId,
      usageRecord as unknown as Record<string, unknown>
    );

    return usageRecord;
  }

  public async resetMonthlyCredits(
    userId: string,
    monthlyAllowance: number
  ): Promise<CreditBalance> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const balance = await this.getCreditBalance(validUserId);

    const resetBalance: CreditBalance = {
      ...balance,
      monthlyAllowance,
      monthlyRemaining: monthlyAllowance,
      lastResetAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc(this.collectionName, validUserId, resetBalance as unknown as Record<string, unknown>);

    logger.info('Monthly credits reset', {
      userId: validUserId,
      operation: 'resetMonthlyCredits',
      status: 'SUCCESS',
      newAllowance: monthlyAllowance,
    });

    return resetBalance;
  }
}
