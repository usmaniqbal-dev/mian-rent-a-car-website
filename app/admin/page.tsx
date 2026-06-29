import { redirect } from "next/navigation";
import { clearSessionCookie, getAdminFromRequest } from "@/lib/auth";
import { hasDatabaseUrl, sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getAdminFromRequest();
  if (!admin) return <LoginView />;
  const [vehicles, bookings, blogs, seo] = hasDatabaseUrl() ? await Promise.all([
    sql`select * from vehicles order by sort_order, name`.catch(() => ({ rows: [] })),
    sql`select * from bookings order by created_at desc limit 50`.catch(() => ({ rows: [] })),
    sql`select * from blogs order by created_at desc`.catch(() => ({ rows: [] })),
    sql`select * from seo_settings order by page_path`.catch(() => ({ rows: [] }))
  ]) : [{ rows: [] }, { rows: [] }, { rows: [] }, { rows: [] }];
  return (
    <main className="admin-shell">
      <aside className="admin-side">
        <h2>CarMian Admin</h2>
        <nav className="admin-tabs">
          {["Dashboard","Hero Section","Logo","Contact / WhatsApp","Vehicles","Pricing","About Page","Customer Reviews","Blogs","SEO Settings","Bookings"].map(item => <a className="admin-tab" href={`#${item.toLowerCase().replaceAll(" ","-")}`} key={item}>{item}</a>)}
          <form action={async () => { "use server"; await clearSessionCookie(); redirect("/admin"); }}><button className="admin-tab">Logout</button></form>
        </nav>
      </aside>
      <section className="admin-main">
        <div className="admin-top"><div><span className="eyebrow">Production Admin</span><h1>Website Manager</h1></div></div>
        <div className="admin-card" id="dashboard"><h2>Dashboard</h2><div className="counter-row"><div className="counter-box"><strong>{vehicles.rows.length}</strong><span>Vehicles</span></div><div className="counter-box"><strong>{bookings.rows.length}</strong><span>Recent Bookings</span></div><div className="counter-box"><strong>{blogs.rows.length}</strong><span>Blogs</span></div><div className="counter-box"><strong>{seo.rows.length}</strong><span>SEO Pages</span></div></div></div>
        <AdminPlaceholder title="Hero Section" endpoint="/api/admin/hero" />
        <AdminPlaceholder title="Logo" endpoint="/api/admin/logo" />
        <AdminPlaceholder title="Contact / WhatsApp" endpoint="/api/admin/contact" />
        <AdminTable title="Vehicles" rows={vehicles.rows} columns={["name","category","price_lahore","price_outside","active"]} />
        <AdminPlaceholder title="Pricing" endpoint="/api/admin/pricing" />
        <AdminPlaceholder title="About Page" endpoint="/api/admin/about" />
        <AdminPlaceholder title="Customer Reviews" endpoint="/api/admin/reviews" />
        <AdminTable title="Blogs" rows={blogs.rows} columns={["title","slug","status","published_date"]} />
        <AdminTable title="SEO Settings" rows={seo.rows} columns={["page_name","page_path","meta_title"]} />
        <AdminTable title="Bookings" rows={bookings.rows} columns={["vehicle_name","full_name","phone","status","created_at"]} />
      </section>
    </main>
  );
}

function LoginView() {
  return <main className="admin-login show"><form className="admin-login-card" method="post" action="/api/auth/login"><span className="eyebrow">Secure Admin</span><h2>CarMian Admin Login</h2><p>Use ADMIN1 / ADMIN1 after seeding.</p><div className="field"><label>Username</label><input name="username" required /></div><div className="field"><label>Password</label><input name="password" type="password" required /></div><button className="dark-submit">Login</button></form></main>;
}

function AdminPlaceholder({ title, endpoint }: { title: string; endpoint: string }) {
  return <section className="admin-card" id={title.toLowerCase().replaceAll(" ","-")}><h2>{title}</h2><p>Use the protected endpoint <code>{endpoint}</code> for full create/update operations. The production API is wired for this section.</p></section>;
}

function AdminTable({ title, rows, columns }: { title: string; rows: any[]; columns: string[] }) {
  return <section className="admin-card" id={title.toLowerCase().replaceAll(" ","-")}><h2>{title}</h2><div className="admin-table-wrap"><table className="admin-table"><thead><tr>{columns.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={row.id || i}>{columns.map(c => <td key={c}>{String(row[c] ?? "")}</td>)}</tr>)}</tbody></table></div></section>;
}
