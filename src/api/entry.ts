import { schema, db } from "~/db";
import { eq } from "drizzle-orm";

type CreateEntryInput = Pick<schema.Entry, "name" | "time" | "dayId">;
type UpdateEntryInput = Pick<schema.Entry, "name" | "time">;

export const entry = {
  allForDay: async (dayId: number) => {
    return db.query.entry.findMany({
      where: eq(schema.entry.dayId, dayId),
    });
  },
  all: async () => {
    return db.query.entry.findMany();
  },
  one: async (id: number) => {
    return db.query.entry.findFirst({
      where: eq(schema.entry.id, id),
    });
  },
  create: async (input: CreateEntryInput) => {
    const newEntries: schema.Entry[] = await db
      .insert(schema.entry)
      .values({ ...input, updatedAt: new Date(), createdAt: new Date() })
      .returning();
    return newEntries[0];
  },
  update: async (id: number, input: UpdateEntryInput) => {
    const newEntries: schema.Entry[] = await db
      .update(schema.entry)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(schema.entry.id, id))
      .returning();
    return newEntries[0];
  },
  delete: async (id: number) => {
    await db.delete(schema.entry).where(eq(schema.entry.id, id));
    return { id };
  },
};
