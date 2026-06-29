import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const b = await req.json();
    const { id } = await context.params;
    const row = await sql`
      update about_cards set icon=${b.icon || null}, title=${b.title}, description=${b.description}, active=${Boolean(b.active)}, sort_order=${Number(b.sortOrder || 0)}, updated_at=now()
      where id=${id} returning *
    `;
    return NextResponse.json({ card: row.rows[0] });
  } catch (error) {
    return apiError(error, "Unable to update about card");
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const { id } = await context.params;
    await sql`delete from about_cards where id=${id}`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Unable to delete about card");
  }
}
