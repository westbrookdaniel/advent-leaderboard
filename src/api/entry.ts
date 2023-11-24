import { Entry, sql } from "~/db";

type CreateEntryInput = Pick<Entry, "name" | "time" | "day_id">;
type UpdateEntryInput = Pick<Entry, "name" | "time">;

export const entry = {
  allForDay: async (dayId: number): Promise<Entry[]> => {
    return sql`select * from entries where day_id = ${dayId}`;
  },
  all: async (): Promise<Entry[]> => {
    return sql`select * from entries`;
  },
  one: async (id: number): Promise<Entry> => {
    const entries = await sql`select * from entries where id = ${id}`;
    return entries[0] as Entry;
  },
  create: async (input: CreateEntryInput): Promise<Entry> => {
    const newEntries: Entry[] = await sql`
      insert into entries ${sql(input, "name", "time", "day_id")}
      returning *
    `;
    return newEntries[0];
  },
  update: async (id: number, input: UpdateEntryInput): Promise<Entry> => {
    const newEntries: Entry[] = await sql`
      update entries ${sql(input, "name", "time")}
      where id = ${id}
      returning *
    `;
    return newEntries[0];
  },
  delete: async (id: number) => {
    await sql`delete from entries where id = ${id}`;
    return { id };
  },
};
