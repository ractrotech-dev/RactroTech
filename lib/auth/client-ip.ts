import { headers } from 'next/headers';

export function getClientIp(): string {
  const h = headers();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return h.get('x-real-ip')?.trim() || 'unknown';
}
