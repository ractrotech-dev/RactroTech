/**
 * Postgres error code for "column does not exist" (undefined_column).
 *
 * The app ships features ahead of migrations sometimes. When that happens the
 * right behaviour is to skip the feature, not to trap the reader in a redirect
 * loop or show them a raw database error.
 */
export const UNDEFINED_COLUMN = "42703";
export const UNDEFINED_TABLE = "42P01";

/**
 * PostgREST answers from its schema cache before Postgres sees the query, so on hosted
 * Supabase a table that was never migrated comes back as PGRST205 (and a missing column
 * as PGRST204) rather than the Postgres codes above.
 */
const MISSING = new Set([UNDEFINED_COLUMN, UNDEFINED_TABLE, "PGRST204", "PGRST205"]);

export function isMissingSchema(error: { code?: string } | null | undefined): boolean {
  return Boolean(error?.code && MISSING.has(error.code));
}

export const MIGRATION_HINT =
  "The database is missing the course tables. Run utils/db/migrations/0019_dsa_learning.sql in the Supabase SQL editor.";
