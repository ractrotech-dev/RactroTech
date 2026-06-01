import 'server-only';

import { createClient } from '@/utils/supabase/server';
import { getAdminUser } from '@/utils/admin';
import type { User } from '@supabase/supabase-js';

export class AuthError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthError';
  }
}

export async function requireAuthenticatedUser(): Promise<User> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.id) {
    throw new AuthError();
  }

  return user;
}

export async function getOptionalAdminUser() {
  try {
    return await getAdminUser();
  } catch {
    return null;
  }
}

/** True if the user owns the row or has an admin-level role. */
export function canAccessOwnedResource(
  ownerId: string | null | undefined,
  userId: string,
  isAdmin: boolean,
): boolean {
  if (isAdmin) return true;
  if (!ownerId) return false;
  return ownerId === userId;
}
