/**
 * Edge/middleware-safe in-process rate limiter (per instance; use Upstash for strict global limits).
 */
const buckets = new Map<string, number[]>();

export function checkEdgeRateLimit(
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

export function getRequestIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
