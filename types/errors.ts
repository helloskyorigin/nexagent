export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INSUFFICIENT_CREDITS = 'INSUFFICIENT_CREDITS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONNECTOR_ERROR = 'CONNECTOR_ERROR',
  AI_GATEWAY_ERROR = 'AI_GATEWAY_ERROR',
  ACTION_EXECUTION_ERROR = 'ACTION_EXECUTION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

export class NexorbitError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(code: ErrorCode, message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = 'NexorbitError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
