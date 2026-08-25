'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

import type { ProfileUpdateInput } from '@/lib/auth/profile-types';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/utils/db/db';
import { profilesTable, usersTable } from '@/utils/db/schema';
import { ensureAuthUserInDb } from '@/utils/auth-user-sync';

type ActionResult = { error?: string };

export async function updateProfileAction(input: ProfileUpdateInput): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: 'You must be signed in to update your profile.' };
  }

  await ensureAuthUserInDb(user);

  const now = new Date();

  try {
    await db
      .update(profilesTable)
      .set({
        ...input,
        updated_at: now,
      })
      .where(eq(profilesTable.id, user.id));

    if (input.full_name || input.avatar_url) {
      await db
        .update(usersTable)
        .set({
          ...(input.full_name ? { name: input.full_name } : {}),
          ...(input.avatar_url !== undefined ? { avatar_url: input.avatar_url } : {}),
        })
        .where(eq(usersTable.id, user.id));
    }

    if (input.full_name) {
      await supabase.auth.updateUser({
        data: { full_name: input.full_name },
      });
    }

    revalidatePath('/account', 'layout');
    revalidatePath('/account/settings');
    return {};
  } catch {
    return { error: 'Could not save profile. Please try again.' };
  }
}
