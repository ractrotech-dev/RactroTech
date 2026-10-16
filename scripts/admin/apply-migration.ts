/**
 * Applies a numbered migration from utils/db/migrations.
 *
 *   npm run db:apply -- 0021_lead_finder
 *
 * Uses DIRECT_URL (the session pooler on 5432) rather than DATABASE_URL, because
 * DDL belongs on a real session. Reads .env.local, then .env.
 */

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';
import postgres from 'postgres';

import { getPostgresSsl } from '../../utils/db/postgres-ssl';

config({ path: ['.env.local', '.env'] });

async function main() {
  const name = process.argv[2];
  if (!name) {
    console.error('Usage: npm run db:apply -- <migration-name-without-.sql>');
    process.exit(1);
  }

  const dir = path.join(process.cwd(), 'utils/db/migrations');
  const match = readdirSync(dir).find((f) => f === `${name}.sql` || f.replace(/\.sql$/, '') === name);
  if (!match) {
    console.error(`No migration named "${name}" in ${dir}.`);
    process.exit(1);
  }

  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString?.trim()) {
    console.error(`Missing DIRECT_URL in .env.local. Apply ${match} in the Supabase SQL editor instead.`);
    process.exit(1);
  }

  console.log(`Applying ${match}...`);
  const sql = postgres(connectionString, { max: 1, ssl: getPostgresSsl() });
  try {
    await sql.unsafe(readFileSync(path.join(dir, match), 'utf8'));
    console.log('Applied.');
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
