/** Cookie that carries `next` across an OAuth round trip, read once by /auth/callback. */
export const OAUTH_NEXT_COOKIE = 'auth_next';

/**
 * Where to send someone after they sign in, when a page asked for it with `?next=`
 * (for example /dsa/profile sending a signed-out reader to /login).
 *
 * Same-site paths only. `//evil.com` and `/\evil.com` look like paths but browsers
 * navigate to them as other origins, so both are refused. Returns null for anything
 * unsafe, and callers fall back to their usual destination.
 */
export function safeNextPath(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 512) return null;
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return null;
  return value;
}
