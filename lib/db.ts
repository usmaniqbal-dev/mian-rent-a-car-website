import "server-only";
import { sql } from "@vercel/postgres";

export { sql };

export function hasDatabaseUrl() {
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL_NON_POOLING);
}

export async function one<T>(query: Promise<{ rows: T[] }>): Promise<T | null> {
  const result = await query;
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
