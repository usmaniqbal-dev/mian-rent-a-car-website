import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const b = await req.json();
    const row = await sql`
      insert into about_cards (icon, title, description, active, sort_order)
      values (${b.icon || null}, ${b.title}, ${b.description}, ${Boolean(b.active)}, ${Number(b.sortOrder || 0)})
      returning *
    `;
    return NextResponse.json({ card: row.rows[0] }, { status: 201 });
  } catch (error) {
    return apiError(error, "Unable to save about card");
  }
}
