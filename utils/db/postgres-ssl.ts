/**
 * SSL options for Postgres clients (drizzle-kit migrate, postgres.js, scripts).
 * Supabase and some corporate proxies present chains that Node rejects unless configured.
 */
export function getPostgresSsl():
  | boolean
  | { rejectUnauthorized: boolean }
  | undefined {
  const explicit = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED?.trim().toLowerCase();
  if (explicit === 'true') {
    return { rejectUnauthorized: true };
  }
  if (explicit === 'false') {
    return { rejectUnauthorized: false };
  }

  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '';
  const isSupabase =
    url.includes('supabase.co') || url.includes('pooler.supabase.com');

  if (isSupabase) {
    return { rejectUnauthorized: false };
  }

  return undefined;
}

/** Parsed credentials for drizzle-kit (it ignores `ssl` when `url` is used). */
export function parsePostgresUrl(connectionString: string) {
  const normalized = connectionString.replace(/^postgresql:\/\//i, 'postgres://');
  const parsed = new URL(normalized);

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 5432,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, '') || 'postgres',
  };
}
