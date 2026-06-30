import { hasDatabaseUrl, safeQuery, sql } from "@/lib/db";
import { fallbackSiteData } from "@/lib/fallback-data";

export type SiteData = {
  hero: any;
  logo: any;
  contact: any;
  vehicles: any[];
  pricing: any[];
  about: any;
  aboutCards: any[];
  reviews: any[];
};

export async function getSiteData(): Promise<SiteData> {
  if (!hasDatabaseUrl()) return fallbackSiteData;
  const [hero, logo, contact, vehicles, pricing, about, aboutCards, reviews] = await Promise.all([
    safeQuery(sql`select * from hero_sections where active = true order by updated_at desc limit 1`),
    safeQuery(sql`select * from logos where active = true order by updated_at desc limit 1`),
    safeQuery(sql`select * from contact_info order by updated_at desc limit 1`),
    safeQuery(sql`select * from vehicles where active = true order by sort_order, name`),
    safeQuery(sql`select * from pricing_rates where active = true order by sort_order, destination_city`),
    safeQuery(sql`select * from about_content order by updated_at desc limit 1`),
    safeQuery(sql`select * from about_cards where active = true order by sort_order, title`),
    safeQuery(sql`select * from customer_reviews where active = true order by sort_order, created_at desc`)
  ]);
  return {
    hero: hero.rows[0] || fallbackSiteData.hero,
    logo: logo.rows[0] || fallbackSiteData.logo,
    contact: contact.rows[0] || fallbackSiteData.contact,
    vehicles: vehicles.rows.length ? vehicles.rows : fallbackSiteData.vehicles,
    pricing: pricing.rows.length ? pricing.rows : fallbackSiteData.pricing,
    about: about.rows[0] || fallbackSiteData.about,
    aboutCards: aboutCards.rows.length ? aboutCards.rows : fallbackSiteData.aboutCards,
    reviews: reviews.rows.length ? reviews.rows : fallbackSiteData.reviews
  };
}
