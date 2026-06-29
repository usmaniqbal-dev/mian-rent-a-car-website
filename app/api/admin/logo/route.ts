import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { logoSchema } from "@/lib/validations";
import { apiError } from "@/lib/api";

export async function PUT(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const body = logoSchema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid logo data" }, { status: 400 });
    const l = body.data;
    await sql`update logos set active=false`;
    const row = await sql`
      insert into logos (image_url, logo_text, brand_name, active)
      values (${l.imageUrl || null}, ${l.logoText}, ${l.brandName}, true)
      returning *
    `;
    return NextResponse.json({ logo: row.rows[0] });
  } catch (error) {
    return apiError(error, "Unable to save logo");
  }
}
