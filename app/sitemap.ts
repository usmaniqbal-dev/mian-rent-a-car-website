import { MetadataRoute } from "next";
import { safeQuery, sql } from "@/lib/db";

function safeDate(value: string | Date | null) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.carmian.com";
  const blogs = await safeQuery(sql<{ slug: string; updated_at: string | null }>`select slug, updated_at from blogs where status='published'`);
  return [
    { url: site, lastModified: new Date() },
    { url: `${site}/blogs`, lastModified: new Date() },
    ...blogs.rows.map(blog => ({ url: `${site}/blogs/${blog.slug}`, lastModified: safeDate(blog.updated_at) }))
  ];
}
