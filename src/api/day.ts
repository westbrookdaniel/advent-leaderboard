import { Day, sql } from "~/db";

export const day = {
  today: async (): Promise<Day> => {
    const today = new Date().toISOString().slice(0, 10);
    const entries = await sql`select * from days where date = ${today}`;
    return entries[0] as Day;
  },
  all: async (): Promise<Day[]> => {
    return sql`select * from days`;
  },
  one: async (id: number): Promise<Day> => {
    const entries = await sql`select * from days where id = ${id}`;
    return entries[0] as Day;
  },
  create: async (date: Date): Promise<Day> => {
    const newEntries: Day[] = await sql`
      insert into days ${sql({ date: date.toISOString().slice(0, 10) }, "date")}
      returning *
    `;
    return newEntries[0];
  },
  delete: async (id: number) => {
    await sql`delete from days where id = ${id}`;
    return { id };
  },
};
