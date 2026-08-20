import { Nexorbit_CONFIG, PlanType } from '../../config';
import { inMemoryStore } from '../../lib/firebase';
import { Subscription } from '../../types/models';
import { ErrorCode, NexorbitError } from '../../types/errors';
import { CreditService } from '../credits/credit.service';
import { UserIsolationService } from '../security/user-isolation.service';

export class SubscriptionService {
  private readonly collectionName = 'subscriptions';
  private readonly creditService: CreditService;

  constructor(creditService?: CreditService) {
    this.creditService = creditService || new CreditService();
  }

  public async getSubscription(userId: string): Promise<Subscription> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const existing = inMemoryStore.getDoc(this.collectionName, validUserId) as Subscription | null;

    if (existing) {
      return existing;
    }

    // Default to FREE tier
    const defaultSub: Subscription = {
      id: `sub_${validUserId}`,
      userId: validUserId,
      plan: 'FREE',
      status: 'ACTIVE',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc(this.collectionName, validUserId, defaultSub as unknown as Record<string, unknown>);
    return defaultSub;
  }

  public async setPlan(userId: string, plan: PlanType): Promise<Subscription> {
    const validUserId = UserIsolationService.sanitizeUserId(userId);
    const sub = await this.getSubscription(validUserId);

    if (!Nexorbit_CONFIG.plans[plan]) {
      throw new NexorbitError(ErrorCode.VALIDATION_ERROR, `Invalid plan type: ${plan}`);
    }

    const updatedSub: Subscription = {
      ...sub,
      plan,
      status: 'ACTIVE',
      updatedAt: new Date().toISOString(),
    };

    inMemoryStore.setDoc(
      this.collectionName,
      validUserId,
      updatedSub as unknown as Record<string, unknown>
    );

    // Update monthly credits based on plan allowance
    const allowance = Nexorbit_CONFIG.plans[plan].monthlyCredits;
    await this.creditService.resetMonthlyCredits(validUserId, allowance);

    return updatedSub;
  }
}
