export interface LogContext {
  requestId?: string;
  userId?: string;
  operation: string;
  status: 'SUCCESS' | 'ERROR' | 'IN_PROGRESS';
  durationMs?: number;
  [key: string]: unknown;
}

const SENSITIVE_KEYS = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'apiKey',
  'secret',
  'authorization',
  'email_content',
  'doc_content',
];

function sanitize(obj: Record<string, unknown>): Record<string, unknown> {
  if (!obj || typeof obj !== 'object') return {};

  const sanitized: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      sanitized[key] = sanitize(val as Record<string, unknown>);
    } else {
      sanitized[key] = val;
    }
  }
  return sanitized;
}

export const logger = {
  info(message: string, context: LogContext) {
    const time = new Date().toISOString();
    const cleanCtx = sanitize(context);
    console.log(JSON.stringify({ level: 'INFO', time, message, ...cleanCtx }));
  },

  warn(message: string, context: LogContext) {
    const time = new Date().toISOString();
    const cleanCtx = sanitize(context);
    console.warn(JSON.stringify({ level: 'WARN', time, message, ...cleanCtx }));
  },

  error(message: string, context: LogContext & { error?: unknown }) {
    const time = new Date().toISOString();
    const cleanCtx = sanitize(context);
    const errDetails =
      context.error instanceof Error
        ? { name: context.error.name, message: context.error.message }
        : context.error;

    console.error(
      JSON.stringify({
        level: 'ERROR',
        time,
        message,
        ...cleanCtx,
        error: errDetails,
      })
    );
  },
};
