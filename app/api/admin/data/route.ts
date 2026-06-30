import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSiteData } from "@/lib/site-data";
import { safeQuery, sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const guard = await requireAdmin(req);
    if (guard.response) return guard.response;

    const [site, vehicles, pricing, aboutCards, reviews, blogs, categories, seo, bookings, files] = await Promise.all([
      getSiteData(),
      safeQuery(sql`select * from vehicles order by sort_order, name`),
      safeQuery(sql`select * from pricing_rates order by sort_order, destination_city`),
      safeQuery(sql`select * from about_cards order by sort_order, title`),
      safeQuery(sql`select * from customer_reviews order by sort_order, created_at desc`),
      safeQuery(sql`select blogs.*, blog_categories.name as category_name from blogs left join blog_categories on blogs.category_id = blog_categories.id order by blogs.created_at desc`),
      safeQuery(sql`select * from blog_categories order by name`),
      safeQuery(sql`select * from seo_settings order by page_path`),
      safeQuery(sql`select * from bookings order by created_at desc limit 100`),
      safeQuery(sql`select * from uploaded_files order by created_at desc limit 100`)
    ]);

    return NextResponse.json({
      site,
      vehicles: vehicles.rows,
      pricing: pricing.rows,
      aboutCards: aboutCards.rows,
      reviews: reviews.rows,
      blogs: blogs.rows,
      categories: categories.rows,
      seo: seo.rows,
      bookings: bookings.rows,
      files: files.rows
    });
  } catch (error) {
    return apiError(error, "Unable to load admin data");
  }
}
