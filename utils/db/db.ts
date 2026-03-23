import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// NOTE:
// - We still use Drizzle in multiple server components.
// - Vercel build/typecheck runs without `DATABASE_URL` available.
// - To avoid build-time type errors, we create a Drizzle client using a fallback URL.
//   Queries will only run at request-time; if you don't provide `DATABASE_URL` in prod,
//   those queries will fail then (which is expected).
const databaseUrl =
  process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/postgres";

// Disable prepare as it is not supported for "Transaction" pool mode.
const client = postgres(databaseUrl, { prepare: false });
export const db = drizzle(client);
