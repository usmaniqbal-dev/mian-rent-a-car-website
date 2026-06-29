import { MetadataRoute } from "next";
import { hasDatabaseUrl, sql } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.carmian.com";
  const blogs = hasDatabaseUrl()
    ? await sql<{ slug: string; updated_at: string }>`select slug, updated_at from blogs where status='published'`.catch(() => ({ rows: [] }))
    : { rows: [] };
  return [
    { url: site, lastModified: new Date() },
    { url: `${site}/blogs`, lastModified: new Date() },
    ...blogs.rows.map(blog => ({ url: `${site}/blogs/${blog.slug}`, lastModified: new Date(blog.updated_at) }))
  ];
}
