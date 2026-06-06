'use server';

import { randomUUID } from 'crypto';

import { createClient } from '@/utils/supabase/server';
import {
  CLIENT_CATEGORIES,
  CLIENT_STAGES,
  type ClientActionState,
  type ClientCategory,
  type ClientStage,
} from '@/utils/clients/constants';
import { insertClientsIntoDatabase } from '@/utils/clients/bulk-insert';
import type { ParsedClientRow } from '@/utils/clients/import-types';
import { revalidatePath } from 'next/cache';

export type BulkImportResult = {
  message: string;
  success: boolean;
  imported: number;
  skipped: number;
};

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in.');
  return { supabase, user };
}

function parseClientForm(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const phone = (formData.get('phone') as string)?.trim() || null;
  const company = (formData.get('company') as string)?.trim() || null;
  const notes = (formData.get('notes') as string)?.trim() || null;
  const status = (formData.get('status') as ClientStage) || 'onboarding';
  const category = (formData.get('category') as ClientCategory) || 'other';
  const state = (formData.get('state') as string)?.trim() || null;
  const region = (formData.get('region') as string)?.trim() || null;
  const country =
    (formData.get('country') as string)?.trim() || 'United Kingdom';

  if (!email) {
    return { error: 'Email is required.' as const };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Enter a valid email address.' as const };
  }

  const resolvedName =
    name || company || email.split('@')[0] || 'Client';

  const validStage = CLIENT_STAGES.some((s) => s.value === status);
  if (!validStage) {
    return { error: 'Invalid stage.' as const };
  }

  const validCategory = CLIENT_CATEGORIES.some((c) => c.value === category);
  if (!validCategory) {
    return { error: 'Invalid category.' as const };
  }

  return {
    name: resolvedName,
    email,
    phone,
    company,
    notes,
    status,
    category,
    state,
    region,
    country,
  };
}

export async function createClientRecord(
  _prev: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  try {
    const { supabase, user } = await requireUser();
    const parsed = parseClientForm(formData);
    if ('error' in parsed) return { message: parsed.error, success: false };

    const { error } = await supabase.from('clients').insert({
      id: randomUUID(),
      ...parsed,
      user_id: user.id,
    });

    if (error) {
      return { message: error.message, success: false };
    }

    revalidatePath('/dashboard');
    return { message: `${parsed.name} added successfully.`, success: true };
  } catch (e) {
    return {
      message: e instanceof Error ? e.message : 'Failed to create client.',
      success: false,
    };
  }
}

export async function updateClientRecord(
  _prev: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  try {
    const { supabase, user } = await requireUser();
    const id = (formData.get('id') as string)?.trim();
    if (!id) return { message: 'Client id is required.', success: false };

    const parsed = parseClientForm(formData);
    if ('error' in parsed) return { message: parsed.error, success: false };

    const { error } = await supabase
      .from('clients')
      .update({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        company: parsed.company,
        category: parsed.category,
        state: parsed.state,
        region: parsed.region,
        country: parsed.country,
        notes: parsed.notes,
        status: parsed.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return { message: error.message, success: false };
    }

    revalidatePath('/dashboard');
    return { message: `${parsed.name} updated.`, success: true };
  } catch (e) {
    return {
      message: e instanceof Error ? e.message : 'Failed to update client.',
      success: false,
    };
  }
}

export async function bulkImportClients(
  rows: ParsedClientRow[],
): Promise<BulkImportResult> {
  try {
    const { supabase, user } = await requireUser();
    const result = await insertClientsIntoDatabase(supabase, user.id, rows);
    if (result.success) {
      revalidatePath('/dashboard');
    }
    return result;
  } catch (e) {
    return {
      message: e instanceof Error ? e.message : 'Import failed.',
      success: false,
      imported: 0,
      skipped: 0,
    };
  }
}

export async function deleteClientRecord(clientId: string): Promise<ClientActionState> {
  try {
    const { supabase, user } = await requireUser();
    if (!clientId) return { message: 'Client id is required.', success: false };

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)
      .eq('user_id', user.id);

    if (error) {
      return { message: error.message, success: false };
    }

    revalidatePath('/dashboard');
    return { message: 'Client removed.', success: true };
  } catch (e) {
    return {
      message: e instanceof Error ? e.message : 'Failed to delete client.',
      success: false,
    };
  }
}
