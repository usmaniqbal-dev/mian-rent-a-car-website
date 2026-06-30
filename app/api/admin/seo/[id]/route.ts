import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const { id } = await context.params;
    await sql`delete from seo_settings where id=${id}`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Unable to delete SEO setting");
  }
}
