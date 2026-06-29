import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const rows = await sql`select * from blog_categories order by name`;
    return NextResponse.json({ categories: rows.rows });
  } catch (error) {
    return apiError(error, "Unable to load blog categories");
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const b = await req.json();
    const row = await sql`insert into blog_categories (name, slug, description, active) values (${b.name}, ${b.slug}, ${b.description || null}, ${Boolean(b.active)}) returning *`;
    return NextResponse.json({ category: row.rows[0] }, { status: 201 });
  } catch (error) {
    return apiError(error, "Unable to save blog category");
  }
}
