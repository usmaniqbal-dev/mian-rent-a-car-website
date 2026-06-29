import Link from "next/link";
import { notFound } from "next/navigation";
import { hasDatabaseUrl, sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = hasDatabaseUrl() ? await sql<any>`select * from blogs where slug=${slug} and status='published' limit 1`.catch(() => ({ rows: [] })) : { rows: [] };
  const row = blog.rows[0];
  if (!row) return {};
  return {
    title: row.meta_title || row.title,
    description: row.meta_description || row.short_excerpt,
    alternates: { canonical: row.canonical_url || `/blogs/${row.slug}` },
    openGraph: { title: row.og_title || row.title, description: row.og_description || row.short_excerpt, images: row.og_image_url ? [row.og_image_url] : undefined }
  };
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = hasDatabaseUrl() ? await sql<any>`select blogs.*, blog_categories.name as category_name from blogs left join blog_categories on blogs.category_id=blog_categories.id where blogs.slug=${slug} and blogs.status='published' limit 1`.catch(() => ({ rows: [] })) : { rows: [] };
  const row = blog.rows[0];
  if (!row) notFound();
  const related = hasDatabaseUrl() ? await sql<any>`select title, slug from blogs where status='published' and slug<>${slug} order by published_date desc nulls last limit 3`.catch(() => ({ rows: [] })) : { rows: [] };
  return (
    <main>
      <section className="section-pad">
        <div className="container">
          <span className="eyebrow">{row.category_name || "Car Rental"}</span>
          <h1 className="section-title">{row.title}</h1>
          <p className="section-sub">By {row.author} · {row.published_date ? new Date(row.published_date).toLocaleDateString() : "CarMian"}</p>
          {row.featured_image_url && <img src={row.featured_image_url} alt={row.title} style={{ width: "100%", maxHeight: 520, objectFit: "cover", borderRadius: 8 }} />}
          <article className="admin-card" style={{ marginTop: 24, padding: 28 }} dangerouslySetInnerHTML={{ __html: row.full_content }} />
          <div className="admin-card" style={{ marginTop: 24, padding: 24 }}>
            <h3>Related Blogs</h3>
            <div className="footer-links">{related.rows.map(item => <Link key={item.slug} href={`/blogs/${item.slug}`}>{item.title}</Link>)}</div>
            <p><a className="wa-btn" href="https://wa.me/923044008105">💬 Book on WhatsApp</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}
