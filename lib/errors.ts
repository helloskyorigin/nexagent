import { NextResponse } from 'next/server';
import { ApiErrorResponse, ErrorCode, NexorbitError } from '../types/errors';
import { logger } from './logger';

export function handleApiError(error: unknown, requestId?: string): NextResponse<ApiErrorResponse> {
  if (error instanceof NexorbitError) {
    logger.warn(`API Error: ${error.message}`, {
      operation: 'handleApiError',
      status: 'ERROR',
      requestId,
      code: error.code,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          requestId,
        },
      },
      { status: error.statusCode }
    );
  }

  // Unhandled error
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  logger.error(`Internal API Error: ${message}`, {
    operation: 'handleApiError',
    status: 'ERROR',
    requestId,
    error,
  });

  return NextResponse.json(
    {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Internal server error',
        requestId,
      },
    },
    { status: 500 }
  );
}
