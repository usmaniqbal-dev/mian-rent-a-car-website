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
      update blogs set title=${b.title}, slug=${b.slug}, meta_title=${b.metaTitle || null}, meta_description=${b.metaDescription || null},
      focus_keywords=${b.focusKeywords || null}, featured_image_url=${b.featuredImageUrl || null}, category_id=${b.categoryId || null},
      short_excerpt=${b.shortExcerpt || null}, full_content=${b.fullContent}, author=${b.author || "Mian Rent A Car"}, status=${b.status || "draft"},
      published_date=${b.publishedDate || null}, canonical_url=${b.canonicalUrl || null}, og_title=${b.ogTitle || null}, og_description=${b.ogDescription || null},
      og_image_url=${b.ogImageUrl || null}, schema_type=${b.schemaType || "Article"}, sort_order=${Number(b.sortOrder || 0)}, updated_at=now()
      where id=${id} returning *
    `;
    return NextResponse.json({ blog: row.rows[0] });
  } catch (error) {
    return apiError(error, "Unable to update blog");
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const { id } = await context.params;
    await sql`delete from blogs where id=${id}`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error, "Unable to delete blog");
  }
}
