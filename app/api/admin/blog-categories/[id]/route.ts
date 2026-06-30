import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const body = await req.json();
    const { id } = await context.params;
    const row = await sql`
      update blog_categories set name=${body.name}, slug=${body.slug}, description=${body.description || null},
      active=${Boolean(body.active)}, updated_at=now()
      where id=${id} returning *
    `;
    return NextResponse.json({ category: row.rows[0] });
  } catch (error) {
    return apiError(error, "Unable to update blog category");
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const { id } = await context.params;
    await sql`delete from blog_categories where id=${id}`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Unable to delete blog category");
  }
}
