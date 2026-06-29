import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { heroSchema } from "@/lib/validations";
import { apiError } from "@/lib/api";

export async function PUT(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const body = heroSchema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid hero data" }, { status: 400 });
    const h = body.data;
    await sql`update hero_sections set active=false`;
    const row = await sql`
      insert into hero_sections (title, description, background_image_url, button_text, button_link, active)
      values (${h.title}, ${h.description}, ${h.backgroundImageUrl || null}, ${h.buttonText}, ${h.buttonLink}, true)
      returning *
    `;
    return NextResponse.json({ hero: row.rows[0] });
  } catch (error) {
    return apiError(error, "Unable to save hero");
  }
}
