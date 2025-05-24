import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './lib/db-schema.ts',
  out: './lib/drizzle',
  dbCredentials: {
    url: process.env.DB_URL!,
  }
})
