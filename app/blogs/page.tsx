import Link from "next/link";
import { safeQuery, sql } from "@/lib/db";
import { getSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getSeo("/blogs");
}

export default async function BlogsPage() {
  const blogs = await safeQuery(sql<any>`
      select blogs.*, blog_categories.name as category_name
      from blogs left join blog_categories on blogs.category_id = blog_categories.id
      where blogs.status = 'published' and (blogs.published_date is null or blogs.published_date <= now())
      order by blogs.published_date desc nulls last, blogs.created_at desc
    `);
  return (
    <main>
      <section className="section-pad">
        <div className="container">
          <div className="center">
            <span className="eyebrow">CarMian Blog</span>
            <h1 className="section-title">Rent A Car Lahore Guides</h1>
            <p className="section-sub">Helpful travel, car rental, airport transfer, wedding, corporate, and intercity travel guides.</p>
          </div>
          {blogs.rows.length === 0 && <div className="admin-card" style={{ padding: 24, textAlign: "center" }}>No blog posts are published yet.</div>}
          <div className="vehicle-grid">
            {blogs.rows.map(blog => (
              <article className="vehicle-card" key={blog.id}>
                <div className="vehicle-image">{blog.featured_image_url ? <img src={blog.featured_image_url} alt={blog.title} /> : <div className="image-fallback">📝</div>}</div>
                <div className="vehicle-body">
                  <span className="pill">{blog.category_name || "Car Rental"}</span>
                  <h2 className="vehicle-name">{blog.title}</h2>
                  <p>{blog.short_excerpt}</p>
                  <Link className="book-btn" href={`/blogs/${blog.slug}`}>Read More</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
