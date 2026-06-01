import type { CookieOptions } from '@supabase/ssr';

export function secureCookieOptions(options: CookieOptions = {}): CookieOptions {
  return {
    ...options,
    httpOnly: options.httpOnly ?? true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: options.sameSite ?? 'lax',
    path: options.path ?? '/',
  };
}
