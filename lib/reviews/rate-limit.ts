/**
 * Best-effort in-process rate limiter (resets on cold starts / multi-instance deploys).
 * For production hardening, add Redis / Upstash or an edge rate-limit product.
 */
const buckets = new Map<string, number[]>();

export function checkReviewRateLimit(
  key: string,
  maxPerWindow = 5,
  windowMs = 60 * 60 * 1000,
): boolean {
  const now = Date.now();
  const prev = buckets.get(key) ?? [];
  const fresh = prev.filter((t) => now - t < windowMs);
  if (fresh.length >= maxPerWindow) return false;
  fresh.push(now);
  buckets.set(key, fresh);
  return true;
}
