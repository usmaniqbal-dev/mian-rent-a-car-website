import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { apiError } from "@/lib/api";

export async function GET() {
  try {
    const [hero, logo, contact, vehicles, pricing, about, aboutCards, reviews] = await Promise.all([
      sql`select * from hero_sections where active = true order by updated_at desc limit 1`,
      sql`select * from logos where active = true order by updated_at desc limit 1`,
      sql`select * from contact_info order by updated_at desc limit 1`,
      sql`select * from vehicles where active = true order by sort_order, name`,
      sql`select * from pricing_rates where active = true order by sort_order, destination_city`,
      sql`select * from about_content order by updated_at desc limit 1`,
      sql`select * from about_cards where active = true order by sort_order, title`,
      sql`select * from customer_reviews where active = true order by sort_order, created_at desc`
    ]);

    return NextResponse.json({
      hero: hero.rows[0],
      logo: logo.rows[0],
      contact: contact.rows[0],
      vehicles: vehicles.rows,
      pricing: pricing.rows,
      about: about.rows[0],
      aboutCards: aboutCards.rows,
      reviews: reviews.rows
    });
  } catch (error) {
    return apiError(error, "Unable to load site data");
  }
}
