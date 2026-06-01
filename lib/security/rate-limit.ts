import 'server-only';

/**
 * Server-side in-process rate limiter (Node runtime / server actions).
 * For production multi-region strict limits, add Upstash Redis.
 */
const buckets = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  maxPerWindow: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const prev = buckets.get(key) ?? [];
  const fresh = prev.filter((t) => now - t < windowMs);
  if (fresh.length >= maxPerWindow) return false;
  fresh.push(now);
  buckets.set(key, fresh);
  return true;
}

export function checkLoginRateLimit(ip: string, email: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  return checkRateLimit(`login:${ip}:${normalizedEmail}`, 5, 15 * 60 * 1000);
}

export function checkForgotPasswordRateLimit(ip: string, email: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  return checkRateLimit(`forgot:${ip}:${normalizedEmail}`, 3, 60 * 60 * 1000);
}

export function checkSignupRateLimit(ip: string): boolean {
  return checkRateLimit(`signup:${ip}`, 5, 60 * 60 * 1000);
}

/** Public contact / enquiry forms. */
export function checkEnquiryRateLimit(ip: string): boolean {
  return checkRateLimit(`enquiry:${ip}`, 5, 60 * 60 * 1000);
}

/** Component library writes (save/update/delete). */
export function checkComponentWriteRateLimit(ip: string, userId: string): boolean {
  return checkRateLimit(`component-write:${ip}:${userId}`, 30, 60 * 60 * 1000);
}

/** Heavy generation-style workloads (library scripts, future AI endpoints). */
export function checkGenerationRateLimit(ip: string, userId?: string): boolean {
  const key = userId ? `gen:${ip}:${userId}` : `gen:${ip}`;
  return checkRateLimit(key, 20, 60 * 60 * 1000);
}

/** Admin server actions per user. */
export function checkAdminActionRateLimit(ip: string, userId: string): boolean {
  return checkRateLimit(`admin:${ip}:${userId}`, 120, 60 * 1000);
}

/** Generic API / webhook traffic. */
export function checkApiRateLimit(ip: string, route: string): boolean {
  return checkRateLimit(`api:${route}:${ip}`, 60, 60 * 1000);
}
