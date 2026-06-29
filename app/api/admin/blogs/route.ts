import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const rows = await sql`select blogs.*, blog_categories.name as category_name from blogs left join blog_categories on blogs.category_id = blog_categories.id order by blogs.created_at desc`;
    return NextResponse.json({ blogs: rows.rows });
  } catch (error) {
    return apiError(error, "Unable to load blogs");
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const b = await req.json();
    const row = await sql`
      insert into blogs (title, slug, meta_title, meta_description, focus_keywords, featured_image_url, category_id, short_excerpt, full_content, author, status, published_date, canonical_url, og_title, og_description, og_image_url, schema_type, sort_order)
      values (${b.title}, ${b.slug}, ${b.metaTitle || null}, ${b.metaDescription || null}, ${b.focusKeywords || null}, ${b.featuredImageUrl || null}, ${b.categoryId || null}, ${b.shortExcerpt || null}, ${b.fullContent}, ${b.author || "Mian Rent A Car"}, ${b.status || "draft"}, ${b.publishedDate || null}, ${b.canonicalUrl || null}, ${b.ogTitle || null}, ${b.ogDescription || null}, ${b.ogImageUrl || null}, ${b.schemaType || "Article"}, ${Number(b.sortOrder || 0)})
      returning *
    `;
    return NextResponse.json({ blog: row.rows[0] }, { status: 201 });
  } catch (error) {
    return apiError(error, "Unable to save blog");
  }
}
