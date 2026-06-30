import "server-only";
import { sql } from "@vercel/postgres";

export { sql };

type QueryResult<T> = { rows: T[] };

export const emptyRows = { rows: [] };

export function hasDatabaseUrl() {
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING);
}

export async function safeQuery<T>(query: Promise<QueryResult<T>>): Promise<QueryResult<T>> {
  if (!hasDatabaseUrl()) return emptyRows as QueryResult<T>;
  try {
    return await query;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Database query failed; using fallback rows.", error);
    }
    return emptyRows as QueryResult<T>;
  }
}

export async function one<T>(query: Promise<{ rows: T[] }>): Promise<T | null> {
  const result = await safeQuery(query);
  return result.rows[0] ?? null;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parsePrice(value: string) {
  const match = value.replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}
