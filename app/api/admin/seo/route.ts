import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const rows = await sql`select * from seo_settings order by page_path`;
    return NextResponse.json({ seo: rows.rows });
  } catch (error) {
    return apiError(error, "Unable to load SEO settings");
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;
    const b = await req.json();
    const row = await sql`
      insert into seo_settings (page_name, page_path, meta_title, meta_description, meta_keywords, focus_keywords, canonical_url, og_title, og_description, og_image_url, twitter_title, twitter_description, twitter_image_url, robots_index, robots_follow, schema_json_ld, extra_head_scripts)
      values (${b.pageName}, ${b.pagePath}, ${b.metaTitle || null}, ${b.metaDescription || null}, ${b.metaKeywords || null}, ${b.focusKeywords || null}, ${b.canonicalUrl || null}, ${b.ogTitle || null}, ${b.ogDescription || null}, ${b.ogImageUrl || null}, ${b.twitterTitle || null}, ${b.twitterDescription || null}, ${b.twitterImageUrl || null}, ${b.robotsIndex !== false}, ${b.robotsFollow !== false}, ${JSON.stringify(b.schemaJsonLd || {})}::jsonb, ${b.extraHeadScripts || null})
      on conflict (page_path) do update set page_name=excluded.page_name, meta_title=excluded.meta_title, meta_description=excluded.meta_description, meta_keywords=excluded.meta_keywords, focus_keywords=excluded.focus_keywords, canonical_url=excluded.canonical_url, og_title=excluded.og_title, og_description=excluded.og_description, og_image_url=excluded.og_image_url, twitter_title=excluded.twitter_title, twitter_description=excluded.twitter_description, twitter_image_url=excluded.twitter_image_url, robots_index=excluded.robots_index, robots_follow=excluded.robots_follow, schema_json_ld=excluded.schema_json_ld, extra_head_scripts=excluded.extra_head_scripts, updated_at=now()
      returning *
    `;
    return NextResponse.json({ seo: row.rows[0] });
  } catch (error) {
    return apiError(error, "Unable to save SEO settings");
  }
}
