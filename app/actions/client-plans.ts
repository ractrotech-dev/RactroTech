'use server';

import { randomUUID } from 'crypto';

import { createClient } from '@/utils/supabase/server';
import {
  CLIENT_CATEGORIES,
  type ClientActionState,
  type ClientCategory,
} from '@/utils/clients/constants';
import {
  cloneChecklistGroups,
  parseChecklistsFromFormValue,
  parseStepsFromFormValue,
} from '@/utils/clients/plan-types';
import { RACTROTECH_UK_DEFAULT_PLAN } from '@/utils/clients/uk-playbook';
import { revalidatePath } from 'next/cache';

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in.');
  return { supabase, user };
}

function parsePlanForm(formData: FormData) {
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const categoryRaw = (formData.get('category') as string)?.trim() || null;
  const stepsJson = (formData.get('steps_json') as string) ?? '[]';
  const checklistsJson = (formData.get('checklists_json') as string) ?? '[]';

  if (!title) {
    return { error: 'Plan title is required.' as const };
  }

  let category: ClientCategory | null = null;
  if (categoryRaw) {
    const valid = CLIENT_CATEGORIES.some((c) => c.value === categoryRaw);
    if (!valid) return { error: 'Invalid category.' as const };
    category = categoryRaw as ClientCategory;
  }

  const stepsResult = parseStepsFromFormValue(stepsJson);
  if ('error' in stepsResult) {
    return { error: stepsResult.error };
  }

  const checklists = parseChecklistsFromFormValue(checklistsJson);

  return { title, description, category, steps: stepsResult, checklists };
}

export async function createOnboardPlan(
  _prev: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  try {
    const { supabase, user } = await requireUser();
    const parsed = parsePlanForm(formData);
    if ('error' in parsed) return { message: parsed.error, success: false };

    const { error } = await supabase.from('client_onboard_plans').insert({
      id: randomUUID(),
      user_id: user.id,
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      steps: parsed.steps,
      checklists: parsed.checklists,
    });

    if (error) return { message: error.message, success: false };

    revalidatePath('/dashboard');
    return { message: `Plan "${parsed.title}" created.`, success: true };
  } catch (e) {
    return {
      message: e instanceof Error ? e.message : 'Failed to create plan.',
      success: false,
    };
  }
}

export async function updateOnboardPlan(
  _prev: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  try {
    const { supabase, user } = await requireUser();
    const id = (formData.get('id') as string)?.trim();
    if (!id) return { message: 'Plan id is required.', success: false };

    const parsed = parsePlanForm(formData);
    if ('error' in parsed) return { message: parsed.error, success: false };

    const { error } = await supabase
      .from('client_onboard_plans')
      .update({
        title: parsed.title,
        description: parsed.description,
        category: parsed.category,
        steps: parsed.steps,
        checklists: parsed.checklists,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) return { message: error.message, success: false };

    revalidatePath('/dashboard');
    return { message: `Plan "${parsed.title}" updated.`, success: true };
  } catch (e) {
    return {
      message: e instanceof Error ? e.message : 'Failed to update plan.',
      success: false,
    };
  }
}

/** Creates the UK playbook when the user has no plans yet. Safe to call repeatedly. */
export async function ensureDefaultOnboardPlan(): Promise<ClientActionState> {
  try {
    const { supabase, user } = await requireUser();

    const { data: existing, error: countError } = await supabase
      .from('client_onboard_plans')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (countError) {
      return { message: countError.message, success: false };
    }

    if (existing?.length) {
      return { message: '', success: true };
    }

    const { error } = await supabase.from('client_onboard_plans').insert({
      id: randomUUID(),
      user_id: user.id,
      title: RACTROTECH_UK_DEFAULT_PLAN.title,
      description: RACTROTECH_UK_DEFAULT_PLAN.description,
      category: RACTROTECH_UK_DEFAULT_PLAN.category,
      steps: RACTROTECH_UK_DEFAULT_PLAN.steps,
      checklists: cloneChecklistGroups(RACTROTECH_UK_DEFAULT_PLAN.checklists),
    });

    if (error) return { message: error.message, success: false };

    revalidatePath('/dashboard');
    return {
      message: 'UK full playbook loaded with steps and checklists.',
      success: true,
    };
  } catch (e) {
    return {
      message: e instanceof Error ? e.message : 'Failed to seed default plan.',
      success: false,
    };
  }
}

/** Manual re-seed (e.g. after deleting all plans). */
export async function seedUkDefaultPlan(): Promise<ClientActionState> {
  return ensureDefaultOnboardPlan();
}

export async function deleteOnboardPlan(planId: string): Promise<ClientActionState> {
  try {
    const { supabase, user } = await requireUser();
    if (!planId) return { message: 'Plan id is required.', success: false };

    const { error } = await supabase
      .from('client_onboard_plans')
      .delete()
      .eq('id', planId)
      .eq('user_id', user.id);

    if (error) return { message: error.message, success: false };

    revalidatePath('/dashboard');
    return { message: 'Plan deleted.', success: true };
  } catch (e) {
    return {
      message: e instanceof Error ? e.message : 'Failed to delete plan.',
      success: false,
    };
  }
}
