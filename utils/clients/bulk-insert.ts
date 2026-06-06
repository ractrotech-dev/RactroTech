import type { SupabaseClient } from '@supabase/supabase-js';

import type { ParsedClientRow } from '@/utils/clients/import-types';

export type BulkInsertResult = {
  success: boolean;
  message: string;
  imported: number;
  skipped: number;
};

function rowToPayload(
  row: ParsedClientRow,
  userId: string,
  id: string,
  coreOnly: boolean,
) {
  const base = {
    id,
    user_id: userId,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    notes: row.notes,
    status: row.status,
  };
  if (coreOnly) return base;
  return {
    ...base,
    category: row.category,
    region: row.region,
    state: row.state,
    country: row.country,
  };
}

function isMissingColumnError(message: string): boolean {
  return (
    message.includes('column') &&
    (message.includes('category') ||
      message.includes('region') ||
      message.includes('state') ||
      message.includes('country'))
  );
}

async function insertChunks(
  supabase: SupabaseClient,
  userId: string,
  rows: ParsedClientRow[],
  coreOnly: boolean,
): Promise<{ ok: true; count: number } | { ok: false; message: string; count: number }> {
  let imported = 0;

  for (let i = 0; i < rows.length; i += 25) {
    const chunk = rows.slice(i, i + 25);
    const payload = chunk.map((row) =>
      rowToPayload(row, userId, crypto.randomUUID(), coreOnly),
    );

    const { data, error } = await supabase
      .from('clients')
      .insert(payload)
      .select('id');

    if (error) {
      return { ok: false, message: error.message, count: imported };
    }

    imported += data?.length ?? chunk.length;
  }

  return { ok: true, count: imported };
}

/** Inserts parsed spreadsheet rows into `clients` for the signed-in user. */
export async function insertClientsIntoDatabase(
  supabase: SupabaseClient,
  userId: string,
  rows: ParsedClientRow[],
): Promise<BulkInsertResult> {
  if (!rows.length) {
    return {
      success: false,
      message: 'No rows to import.',
      imported: 0,
      skipped: 0,
    };
  }

  if (rows.length > 500) {
    return {
      success: false,
      message: 'Maximum 500 rows per upload. Split your sheet.',
      imported: 0,
      skipped: 0,
    };
  }

  const { data: existing } = await supabase
    .from('clients')
    .select('email')
    .eq('user_id', userId);

  const existingEmails = new Set(
    (existing ?? []).map((r) => r.email?.toLowerCase()).filter(Boolean),
  );

  const seenInFile = new Set<string>();
  const toInsert: ParsedClientRow[] = [];
  let skipped = 0;

  for (const row of rows) {
    const email = row.email.toLowerCase();
    if (existingEmails.has(email) || seenInFile.has(email)) {
      skipped++;
      continue;
    }
    seenInFile.add(email);
    toInsert.push(row);
  }

  if (!toInsert.length) {
    return {
      success: false,
      message:
        skipped > 0
          ? 'All rows were skipped (duplicate emails already in your list or file).'
          : 'No new clients to import.',
      imported: 0,
      skipped,
    };
  }

  let attempt = await insertChunks(supabase, userId, toInsert, false);

  if (!attempt.ok && isMissingColumnError(attempt.message)) {
    attempt = await insertChunks(supabase, userId, toInsert, true);
  }

  if (!attempt.ok) {
    const hint = attempt.message.includes('policy')
      ? ' Run utils/db/migrations/0008_clients_dashboard_rls.sql in Supabase.'
      : '';
    return {
      success: false,
      message: `${attempt.message}${hint}`,
      imported: attempt.count,
      skipped: skipped + (toInsert.length - attempt.count),
    };
  }

  return {
    success: true,
    message: `Saved ${attempt.count} client${attempt.count === 1 ? '' : 's'} to the database.${
      skipped ? ` Skipped ${skipped} duplicate email(s).` : ''
    }`,
    imported: attempt.count,
    skipped,
  };
}
