import { schema, db } from "~/db";
import { eq } from "drizzle-orm";

type CreateDayInput = Pick<schema.Day, "date">;

export const day = {
  all: async () => {
    return db.query.entry.findMany();
  },
  one: async (id: number) => {
    return db.query.entry.findFirst({
      where: eq(schema.entry.id, id),
    });
  },
  create: async (input: CreateDayInput) => {
    const newEntries: schema.Day[] = await db
      .insert(schema.day)
      .values({ ...input })
      .returning();
    return newEntries[0];
  },
  delete: async (id: number) => {
    await db.delete(schema.day).where(eq(schema.day.id, id));
    return { id };
  },
};
