import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// NOTE:
// - Drizzle is used in server components and server actions.
// - Vercel build imports this module without `DATABASE_URL`; we lazy-init so build can finish.
// - At request time, set `DATABASE_URL` (Supabase pooler URI) in `.env.local` / Vercel env.

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  if (process.env.NEXT_PHASE === "phase-production-build") {
    return "postgres://postgres:postgres@127.0.0.1:5432/postgres";
  }

  throw new Error(
    "DATABASE_URL is not set. Add your Supabase Postgres URI to .env.local " +
      "(Dashboard → Project Settings → Database → Connection string → URI, Transaction pooler).",
  );
}

let client: ReturnType<typeof postgres> | undefined;
let drizzleDb: PostgresJsDatabase | undefined;

function getDbInstance(): PostgresJsDatabase {
  if (!drizzleDb) {
    client = postgres(resolveDatabaseUrl(), { prepare: false });
    drizzleDb = drizzle(client);
  }
  return drizzleDb;
}

export const db = new Proxy({} as PostgresJsDatabase, {
  get(_target, prop) {
    const instance = getDbInstance();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
