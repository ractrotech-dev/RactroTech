import { defineConfig } from "drizzle-kit";
import { config } from 'dotenv';

config({ path: process.env.NODE_ENV === 'production' ? '.env.local' : '.env' });

export default defineConfig({
    schema: "./utils/db/schema.ts",
    out: "./utils/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DIRECT_URL!,
    },
});