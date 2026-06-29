import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import { apiError } from "@/lib/api";

export async function PUT(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const body = contactSchema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid contact data" }, { status: 400 });
    const c = body.data;
    await sql`delete from contact_info`;
    const row = await sql`
      insert into contact_info (phone1, phone2, phone3, whatsapp, email, address, website_url, facebook_url, instagram_url, tiktok_url, google_maps_embed_url)
      values (${c.phone1}, ${c.phone2}, ${c.phone3}, ${c.whatsapp}, ${c.email}, ${c.address}, ${c.websiteUrl}, ${c.facebookUrl || null}, ${c.instagramUrl || null}, ${c.tiktokUrl || null}, ${c.googleMapsEmbedUrl || null})
      returning *
    `;
    return NextResponse.json({ contact: row.rows[0] });
  } catch (error) {
    return apiError(error, "Unable to save contact information");
  }
}
