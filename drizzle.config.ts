import { defineConfig } from "drizzle-kit";
import { config } from 'dotenv';
import { getPostgresSsl, parsePostgresUrl } from './utils/db/postgres-ssl';

config({ path: process.env.NODE_ENV === 'production' ? '.env.local' : '.env' });

const directUrl = process.env.DIRECT_URL;
if (!directUrl?.trim()) {
  throw new Error(
    'DIRECT_URL is not set. Add your Supabase direct connection string to .env (see .env.example).',
  );
}

// drizzle-kit only applies `ssl` when host/port/user/password are set — not with `url` alone.
const credentials = parsePostgresUrl(directUrl);

export default defineConfig({
    schema: "./utils/db/schema.ts",
    out: "./utils/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        ...credentials,
        ssl: getPostgresSsl(),
    },
});
