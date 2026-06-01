import 'server-only';

export type SecurityEvent =
  | {
      type: 'auth_attempt';
      success: boolean;
      ip: string;
      action: string;
      email?: string;
      reason?: string;
    }
  | { type: 'rate_limit'; ip: string; path: string; action: string }
  | { type: 'api_error'; path: string; action: string; message: string; ip?: string }
  | { type: 'suspicious'; ip: string; detail: string; path?: string };

export function logSecurityEvent(event: SecurityEvent): void {
  const payload = {
    ...event,
    timestamp: new Date().toISOString(),
    service: 'ractrotech',
  };

  if (process.env.NODE_ENV === 'production') {
    console.warn(JSON.stringify(payload));
  } else {
    console.warn('[security]', payload);
  }
}

export function logApiError(action: string, error: unknown, ip?: string): void {
  const message = error instanceof Error ? error.message : String(error);
  logSecurityEvent({
    type: 'api_error',
    path: action,
    action,
    message: message.slice(0, 500),
    ip,
  });
}
