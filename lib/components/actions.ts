'use server';

import 'server-only';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import {
  buildCustomComponentPayload,
  type CustomComponentInput,
  type SaveCustomComponentResult,
} from '@/lib/component-library/save-custom-component';
import { getClientIp } from '@/lib/auth/client-ip';
import { canAccessOwnedResource, getOptionalAdminUser, requireAuthenticatedUser } from '@/lib/auth/session';
import { logSecurityEvent } from '@/lib/security/logger';
import { checkComponentWriteRateLimit } from '@/lib/security/rate-limit';
import { componentInputSchema } from '@/lib/validation/schemas';
import { sanitizeComponentCode, sanitizePlainText, isUuid } from '@/lib/validation/sanitize';
export type { CustomComponentInput, SaveCustomComponentResult };

export async function saveComponentAction(
  input: CustomComponentInput,
): Promise<SaveCustomComponentResult> {
  const parsed = componentInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid component data.' };
  }

  const safeInput = {
    ...parsed.data,
    title: sanitizePlainText(parsed.data.title, 160),
    description: sanitizePlainText(parsed.data.description, 2000),
    code: sanitizeComponentCode(parsed.data.code),
    componentId: parsed.data.componentId ?? null,
    categoryId: parsed.data.categoryId ?? null,
  };

  let user;
  try {
    user = await requireAuthenticatedUser();
  } catch {
    return { ok: false, message: 'You must be signed in to save components.' };
  }

  const ip = getClientIp();
  if (!checkComponentWriteRateLimit(ip, user.id)) {
    logSecurityEvent({ type: 'rate_limit', ip, path: 'components', action: 'save' });
    return { ok: false, message: 'Too many saves. Please try again later.' };
  }

  const admin = await getOptionalAdminUser();
  const supabase = createClient();

  if (safeInput.componentId) {
    const { data: existing, error: loadError } = await supabase
      .from('components')
      .select('id, slug, created_by')
      .eq('id', safeInput.componentId)
      .maybeSingle();

    if (loadError || !existing) {
      return { ok: false, message: 'Could not load component for update.' };
    }

    if (!canAccessOwnedResource(existing.created_by, user.id, Boolean(admin))) {
      return { ok: false, message: 'You do not have permission to edit this component.' };
    }

    const payload = buildCustomComponentPayload(
      safeInput,
      existing.slug ?? undefined,
    );

    let updateQuery = supabase.from('components').update(payload).eq('id', safeInput.componentId);
    if (!admin) {
      updateQuery = updateQuery.eq('created_by', user.id);
    }

    const { error } = await updateQuery;

    if (error) {
      return { ok: false, message: 'Failed to update component.' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/components');
    revalidatePath(`/components/${safeInput.componentId}`);
    return { ok: true, id: safeInput.componentId };
  }

  const payload = {
    ...buildCustomComponentPayload(safeInput),
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from('components')
    .insert(payload)
    .select('id')
    .maybeSingle();

  if (error || !data?.id) {
    return { ok: false, message: 'Failed to save component.' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/components');
  return { ok: true, id: String(data.id) };
}

export async function deleteComponentAction(componentId: string): Promise<{ ok: boolean; message?: string }> {
  const id = componentId?.trim();
  if (!id || !isUuid(id)) return { ok: false, message: 'Invalid component id.' };

  let user;
  try {
    user = await requireAuthenticatedUser();
  } catch {
    return { ok: false, message: 'You must be signed in.' };
  }

  const ip = getClientIp();
  if (!checkComponentWriteRateLimit(ip, user.id)) {
    return { ok: false, message: 'Too many requests. Please try again later.' };
  }

  const admin = await getOptionalAdminUser();
  const supabase = createClient();

  const { data: existing, error: loadError } = await supabase
    .from('components')
    .select('id, created_by')
    .eq('id', id)
    .maybeSingle();

  if (loadError || !existing) {
    return { ok: false, message: 'Component not found.' };
  }

  if (!canAccessOwnedResource(existing.created_by, user.id, Boolean(admin))) {
    return { ok: false, message: 'You do not have permission to delete this component.' };
  }

  let deleteQuery = supabase.from('components').delete().eq('id', id);
  if (!admin) {
    deleteQuery = deleteQuery.eq('created_by', user.id);
  }

  const { error } = await deleteQuery;
  if (error) {
    return { ok: false, message: 'Failed to delete component.' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/components');
  return { ok: true };
}

export type ComponentForEdit = {
  id: string;
  title: string;
  description: string;
  code: string;
  category_id: string | null;
  style_variant: string | null;
  industry_variant: string | null;
  difficulty: string | null;
  supports_dark_mode: boolean | null;
  tags: string[] | null;
};

export async function loadComponentForEditAction(
  componentId: string,
): Promise<{ ok: true; component: ComponentForEdit } | { ok: false; message: string }> {
  const id = componentId?.trim();
  if (!id || !isUuid(id)) return { ok: false, message: 'Invalid component id.' };

  let user;
  try {
    user = await requireAuthenticatedUser();
  } catch {
    return { ok: false, message: 'You must be signed in to edit components.' };
  }

  const admin = await getOptionalAdminUser();
  const supabase = createClient();

  const { data, error } = await supabase
    .from('components')
    .select(
      'id, title, description, code, category_id, style_variant, industry_variant, difficulty, supports_dark_mode, tags, created_by',
    )
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, message: 'Component not found.' };
  }

  if (!canAccessOwnedResource(data.created_by, user.id, Boolean(admin))) {
    return { ok: false, message: 'You do not have permission to edit this component.' };
  }

  return {
    ok: true,
    component: {
      id: String(data.id),
      title: data.title,
      description: data.description,
      code: data.code,
      category_id: data.category_id ? String(data.category_id) : null,
      style_variant: data.style_variant ?? null,
      industry_variant: data.industry_variant ?? null,
      difficulty: data.difficulty ?? null,
      supports_dark_mode: data.supports_dark_mode ?? null,
      tags: data.tags ?? null,
    },
  };
}

export async function listUserComponentsAction(): Promise<
  { ok: true; components: { id: string; title: string; description: string }[] } | { ok: false; message: string }
> {
  let user;
  try {
    user = await requireAuthenticatedUser();
  } catch {
    return { ok: false, message: 'You must be signed in.' };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('components')
    .select('id, title, description')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { ok: false, message: 'Failed to load your components.' };
  }

  return {
    ok: true,
    components: (data ?? []).map((row) => ({
      id: String(row.id),
      title: row.title,
      description: row.description,
    })),
  };
}

export async function createCategoryAction(
  name: string,
): Promise<{ ok: true; id: string; name: string } | { ok: false; message: string }> {
  const trimmed = name?.trim();
  if (!trimmed) return { ok: false, message: 'Category name is required.' };

  try {
    await requireAuthenticatedUser();
  } catch {
    return { ok: false, message: 'You must be signed in to add categories.' };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('category')
    .insert({ name: trimmed })
    .select('id, name')
    .maybeSingle();

  if (error || !data) {
    return { ok: false, message: 'Failed to add category.' };
  }

  return { ok: true, id: String(data.id), name: data.name };
}
