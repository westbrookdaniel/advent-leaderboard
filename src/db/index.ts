import postgres from "postgres";

const connectionString = Bun.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
export const sql = postgres(connectionString);

export type Entry = {
  id: number;
  name: string;
  time: string;
  created_at: string;
  updated_at: string;
  day_id: number;
};

export type Day = {
  id: number;
  date: string;
};

// Migrations
await sql`
  CREATE TABLE IF NOT EXISTS days (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL
  );
`;

await sql`
  CREATE TABLE IF NOT EXISTS entries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    time TIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    day_id INTEGER NOT NULL REFERENCES days (id)
  );
`;
