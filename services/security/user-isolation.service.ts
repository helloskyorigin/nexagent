import { ErrorCode, NexorbitError } from '../../types/errors';

export class UserIsolationService {
  /**
   * Verifies that the resource belongs to the requested userId.
   * Throws ErrorCode.FORBIDDEN if ownership check fails.
   */
  public static validateOwnership(resourceUserId: string, targetUserId: string): void {
    if (!resourceUserId || !targetUserId) {
      throw new NexorbitError(
        ErrorCode.UNAUTHORIZED,
        'Authentication and user context required',
        401
      );
    }

    if (resourceUserId !== targetUserId) {
      throw new NexorbitError(
        ErrorCode.FORBIDDEN,
        'Access denied: You do not have permission to access this resource',
        403
      );
    }
  }

  /**
   * Validates user ID present in server request context.
   */
  public static sanitizeUserId(suppliedUserId?: string): string {
    if (!suppliedUserId || typeof suppliedUserId !== 'string' || suppliedUserId.trim() === '') {
      throw new NexorbitError(
        ErrorCode.UNAUTHORIZED,
        'Missing or invalid user authentication',
        401
      );
    }
    return suppliedUserId.trim();
  }
}
