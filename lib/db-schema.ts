// schema.ts
import { integer, pgTableCreator, timestamp, varchar } from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator((name) => `takvim_${name}`);

export const events = pgTable('events', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  created_at: timestamp(),
  starts_at: timestamp(),
  ends_at: timestamp(),
  desc: varchar(),
})
