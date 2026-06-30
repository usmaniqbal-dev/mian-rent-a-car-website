import { Metadata } from "next";
import { hasDatabaseUrl, safeQuery, sql } from "@/lib/db";

export const targetKeywords = [
  "Rent a car Lahore",
  "Car rental Lahore",
  "Rent a car in Lahore",
  "Mian Rent A Car",
  "CarMian",
  "Rent a car with driver Lahore",
  "Luxury car rental Lahore",
  "Toyota Fortuner rent a car Lahore",
  "HiAce rental Lahore"
];

export async function getSeo(path: string): Promise<Metadata> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.carmian.com";
  const fallback: Metadata = {
    title: "Mian Rent A Car | CarMian Lahore",
    description: "Premium rent a car Lahore service with professional drivers, sedans, SUVs, vans, and luxury cars.",
    alternates: { canonical: `${site}${path}` }
  };

  if (!hasDatabaseUrl()) {
    return fallback;
  }
  const result = await safeQuery(sql<{
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    canonical_url: string | null;
    og_title: string | null;
    og_description: string | null;
    og_image_url: string | null;
    twitter_title: string | null;
    twitter_description: string | null;
    twitter_image_url: string | null;
    robots_index: boolean;
    robots_follow: boolean;
  }>`select * from seo_settings where page_path = ${path} limit 1`);
  const row = result.rows[0];
  if (!row) {
    return fallback;
  }
  return {
    title: row.meta_title || undefined,
    description: row.meta_description || undefined,
    keywords: row.meta_keywords || undefined,
    alternates: { canonical: row.canonical_url || `${site}${path}` },
    robots: { index: row.robots_index, follow: row.robots_follow },
    openGraph: {
      title: row.og_title || row.meta_title || undefined,
      description: row.og_description || row.meta_description || undefined,
      images: row.og_image_url ? [row.og_image_url] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: row.twitter_title || row.og_title || row.meta_title || undefined,
      description: row.twitter_description || row.og_description || row.meta_description || undefined,
      images: row.twitter_image_url ? [row.twitter_image_url] : undefined
    }
  };
}
