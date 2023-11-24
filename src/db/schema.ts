import { relations } from "drizzle-orm";
import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const entry = pgTable("entry", {
  id: serial("id").primaryKey(),
  name: text("name"),
  time: timestamp("time"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  dayId: serial("day_id"),
});

export const entryRelations = relations(entry, ({ one }) => ({
  day: one(day, {
    fields: [entry.dayId],
    references: [day.id],
  }),
}));

export type Entry = typeof entry.$inferSelect;
export type NewEntry = typeof entry.$inferInsert;

export const day = pgTable("entry", {
  id: serial("id").primaryKey(),
  date: text("date"),
});

export const dayRelations = relations(day, ({ many }) => ({
  posts: many(entry),
}));


export type Day = typeof day.$inferSelect;
export type NewDay = typeof day.$inferInsert;
