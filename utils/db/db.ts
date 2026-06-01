import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getPostgresSsl } from "./postgres-ssl";

// NOTE:
// - We still use Drizzle in multiple server components.
// - Vercel build/typecheck runs without `DATABASE_URL` available.
// - To avoid build-time type errors, we create a Drizzle client using a fallback URL.
//   Queries will only run at request-time; if you don't provide `DATABASE_URL` in prod,
//   those queries will fail then (which is expected).
const databaseUrl = process.env.DATABASE_URL;

// Do not throw here when DATABASE_URL is missing: Next/Vercel imports this module during
// `next build` (e.g. via /auth/callback → auth-user-sync). Runtime DB calls will fail
// if DATABASE_URL is unset in deployment env — set it in Vercel project settings.

// Disable prepare as it is not supported for "Transaction" pool mode.
const client = postgres(databaseUrl || "postgres://postgres:postgres@localhost:5432/postgres", {
  prepare: false,
  ssl: getPostgresSsl(),
});
export const db = drizzle(client);
