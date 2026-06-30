import AdminPanel from "@/components/AdminPanel";
import { getAdminFromRequest } from "@/lib/auth";
import { safeQuery, sql } from "@/lib/db";
import { getSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

async function getInitialAdminData() {
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

  return {
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
  };
}

export default async function AdminPage() {
  const admin = await getAdminFromRequest();
  if (!admin) return <LoginView />;
  return <AdminPanel initialData={await getInitialAdminData()} />;
}

function LoginView() {
  return (
    <main className="admin-login show">
      <form className="admin-login-card" method="post" action="/api/auth/login">
        <span className="eyebrow">Secure Admin</span>
        <h2>CarMian Admin Login</h2>
        <p>Sign in to manage the production website.</p>
        <div className="field"><label>Username</label><input name="username" required /></div>
        <div className="field"><label>Password</label><input name="password" type="password" required /></div>
        <button className="dark-submit">Login</button>
      </form>
    </main>
  );
}
