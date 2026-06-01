import type { User } from '@supabase/supabase-js';

/** Supabase sets email_confirmed_at when the address is verified (OAuth providers included). */
export function isEmailVerified(user: User): boolean {
  return Boolean(user.email_confirmed_at);
}
