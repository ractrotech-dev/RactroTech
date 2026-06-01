import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import postgres from 'postgres';
import { getPostgresSsl } from '../../../utils/db/postgres-ssl';

async function main() {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString?.trim()) {
    console.error(
      'Missing DIRECT_URL (or DATABASE_URL) in .env.\n' +
        'Apply utils/db/migrations/0009_component_library.sql and 0010_component_duplicate_detection.sql in the Supabase SQL editor.'
    );
    process.exit(1);
  }

  const migrationsDir = path.join(process.cwd(), 'utils/db/migrations');
  const migrationFiles = readdirSync(migrationsDir)
    .filter((f) => /^0009_|^0010_/.test(f) && f.endsWith('.sql'))
    .sort();

  console.log('Applying component library migrations to Supabase Postgres...');

  const sql = postgres(connectionString, { max: 1, ssl: getPostgresSsl() });
  try {
    for (const file of migrationFiles) {
      const migrationSql = readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log(`Applying ${file}...`);
      await sql.unsafe(migrationSql);
    }
    console.log('Migrations applied successfully.');
    console.log('Next: npm run library:dedup:scan && npm run library:dedup:scan:apply');
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error('Migration failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
