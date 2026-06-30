"use client";

import { useMemo, useState } from "react";

type AdminData = {
  site: any;
  vehicles: any[];
  pricing: any[];
  aboutCards: any[];
  reviews: any[];
  blogs: any[];
  categories: any[];
  seo: any[];
  bookings: any[];
  files: any[];
};

const tabs = [
  "Dashboard",
  "Logo",
  "Hero Section",
  "Contact / WhatsApp",
  "Vehicles",
  "Pricing Table",
  "About Page",
  "About Cards",
  "Customer Reviews",
  "Blogs",
  "Blog Categories",
  "SEO Settings",
  "Bookings",
  "Uploaded Files",
  "Logout"
];

const emptyVehicle = {
  name: "",
  slug: "",
  category: "Sedan",
  image_url: "",
  price_lahore: "",
  price_outside: "",
  weekly_price: "",
  monthly_price: "",
  rating: 5,
  description: "",
  features: "",
  active: true,
  sort_order: 0
};

const emptyPricing = { car_type: "", destination_city: "", one_way_price: "", timing_note: "24 hours, within the same date", active: true, sort_order: 0 };
const emptyCard = { icon: "", title: "", description: "", active: true, sort_order: 0 };
const emptyReview = { customer_name: "", customer_city: "", review_text: "", rating: 5, avatar_initials: "", active: true, sort_order: 0 };
const emptyCategory = { name: "", slug: "", description: "", active: true };
const emptyBlog = {
  title: "",
  slug: "",
  short_excerpt: "",
  full_content: "",
  featured_image_url: "",
  category_id: "",
  meta_title: "",
  meta_description: "",
  published_date: "",
  status: "draft"
};
const emptySeo = {
  page_name: "",
  page_path: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image_url: "",
  twitter_title: "",
  twitter_description: "",
  twitter_image_url: "",
  robots_index: true,
  robots_follow: true,
  schema_json_ld: "{}"
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function valueForDate(value: string | null | undefined) {
  return value ? String(value).slice(0, 10) : "";
}

async function jsonRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export default function AdminPanel({ initialData }: { initialData: AdminData }) {
  const [data, setData] = useState(initialData);
  const [active, setActive] = useState("Dashboard");
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Record<string, any>>({});

  const stats = useMemo(() => ({
    vehicles: data.vehicles.length,
    activeVehicles: data.vehicles.filter(v => v.active).length,
    bookings: data.bookings.length,
    blogs: data.blogs.length,
    seo: data.seo.length,
    reviews: data.reviews.length,
    files: data.files.length
  }), [data]);

  async function refresh() {
    const next = await jsonRequest("/api/admin/data");
    setData(next);
  }

  async function run(action: () => Promise<void>, message = "Saved") {
    try {
      setBusy(true);
      setError("");
      await action();
      await refresh();
      setToast(message);
      window.setTimeout(() => setToast(""), 2600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function upload(file: File, onUrl: (url: string) => void) {
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: form });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || "Upload failed");
    onUrl(body.url);
    await refresh();
  }

  function start(key: string, row: any) {
    setEditing(current => ({ ...current, [key]: { ...row } }));
  }

  function change(key: string, patch: Record<string, any>) {
    setEditing(current => ({ ...current, [key]: { ...(current[key] || {}), ...patch } }));
  }

  async function remove(path: string, label: string) {
    if (!window.confirm(`Delete this ${label}?`)) return;
    await run(() => jsonRequest(path, { method: "DELETE" }), "Deleted");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  return (
    <main className="admin-shell admin-ui">
      <aside className="admin-side">
        <h2>CarMian Admin</h2>
        <nav className="admin-tabs">
          {tabs.map(tab => (
            <button key={tab} className={`admin-tab ${active === tab ? "active" : ""}`} onClick={() => tab === "Logout" ? logout() : setActive(tab)}>{tab}</button>
          ))}
        </nav>
      </aside>

      <section className="admin-main">
        <div className="admin-top">
          <div><span className="eyebrow">Production Admin</span><h1>{active}</h1></div>
          <button className="small-btn" onClick={() => run(refresh, "Refreshed")}>Refresh</button>
        </div>
        {error && <div className="admin-alert error">{error}</div>}
        {toast && <div className="admin-alert">{toast}</div>}

        {active === "Dashboard" && <Dashboard stats={stats} bookings={data.bookings} setActive={setActive} />}
        {active === "Logo" && <LogoSection data={data} run={run} upload={upload} busy={busy} />}
        {active === "Hero Section" && <HeroSection data={data} run={run} upload={upload} busy={busy} />}
        {active === "Contact / WhatsApp" && <ContactSection data={data} run={run} busy={busy} />}
        {active === "Vehicles" && <VehiclesSection rows={data.vehicles} editing={editing} start={start} change={change} run={run} remove={remove} upload={upload} busy={busy} />}
        {active === "Pricing Table" && <PricingSection rows={data.pricing} editing={editing} start={start} change={change} run={run} remove={remove} busy={busy} />}
        {active === "About Page" && <AboutSection data={data} run={run} busy={busy} />}
        {active === "About Cards" && <CardsSection rows={data.aboutCards} editing={editing} start={start} change={change} run={run} remove={remove} busy={busy} />}
        {active === "Customer Reviews" && <ReviewsSection rows={data.reviews} editing={editing} start={start} change={change} run={run} remove={remove} busy={busy} />}
        {active === "Blogs" && <BlogsSection rows={data.blogs} categories={data.categories} editing={editing} start={start} change={change} run={run} remove={remove} upload={upload} busy={busy} />}
        {active === "Blog Categories" && <CategoriesSection rows={data.categories} editing={editing} start={start} change={change} run={run} remove={remove} busy={busy} />}
        {active === "SEO Settings" && <SeoSection rows={data.seo} editing={editing} start={start} change={change} run={run} remove={remove} upload={upload} busy={busy} />}
        {active === "Bookings" && <BookingsSection rows={data.bookings} run={run} remove={remove} busy={busy} />}
        {active === "Uploaded Files" && <UploadedFiles rows={data.files} />}
      </section>
    </main>
  );
}

function Field({ label, value, onChange, type = "text", area = false, required = false }: any) {
  return <div className="field"><label>{label}</label>{area ? <textarea required={required} value={value || ""} onChange={e => onChange(e.target.value)} /> : <input required={required} type={type} value={value ?? ""} onChange={e => onChange(type === "number" ? Number(e.target.value) : e.target.value)} />}</div>;
}

function SelectField({ label, value, onChange, children }: any) {
  return <div className="field"><label>{label}</label><select value={String(value)} onChange={e => onChange(e.target.value)}>{children}</select></div>;
}

function UploadField({ label, value, onChange, upload }: any) {
  return <div className="field full"><label>{label}</label><input type="file" accept="image/*" onChange={e => e.target.files?.[0] && upload(e.target.files[0], onChange)} /><input value={value || ""} onChange={e => onChange(e.target.value)} placeholder="Image URL" />{value && <img className="admin-preview" src={value} alt="" />}</div>;
}

function Dashboard({ stats, bookings, setActive }: any) {
  return <section className="admin-card admin-panel"><div className="admin-stats">
    {Object.entries({
      "Total vehicles": stats.vehicles,
      "Active vehicles": stats.activeVehicles,
      "Recent bookings": stats.bookings,
      Blogs: stats.blogs,
      "SEO pages": stats.seo,
      "Customer Reviews": stats.reviews,
      "Uploaded files": stats.files
    }).map(([label, value]) => <button className="counter-box" key={label} onClick={() => setActive(label === "Uploaded files" ? "Uploaded Files" : label === "Recent bookings" ? "Bookings" : label === "SEO pages" ? "SEO Settings" : label === "Total vehicles" || label === "Active vehicles" ? "Vehicles" : label)}><strong>{String(value)}</strong><span>{label}</span></button>)}
  </div><h2>Recent Bookings</h2><BookingTable rows={bookings.slice(0, 8)} /></section>;
}

function LogoSection({ data, run, upload, busy }: any) {
  const [form, setForm] = useState({ imageUrl: data.site.logo.image_url || "", logoText: data.site.logo.logo_text || "", brandName: data.site.logo.brand_name || "" });
  return <FormCard onSubmit={() => run(() => jsonRequest("/api/admin/logo", { method: "PUT", body: JSON.stringify(form) }))} busy={busy}>
    <UploadField label="Logo image upload / URL" value={form.imageUrl} onChange={(v: string) => setForm({ ...form, imageUrl: v })} upload={upload} />
    <Field label="Logo text" value={form.logoText} onChange={(v: string) => setForm({ ...form, logoText: v })} required />
    <Field label="Brand name" value={form.brandName} onChange={(v: string) => setForm({ ...form, brandName: v })} required />
  </FormCard>;
}

function HeroSection({ data, run, upload, busy }: any) {
  const [form, setForm] = useState({ title: data.site.hero.title || "", description: data.site.hero.description || "", backgroundImageUrl: data.site.hero.background_image_url || "", buttonText: data.site.hero.button_text || "Book Now", buttonLink: data.site.hero.button_link || "#vehicles" });
  return <FormCard onSubmit={() => run(() => jsonRequest("/api/admin/hero", { method: "PUT", body: JSON.stringify(form) }))} busy={busy}>
    <Field label="Heading" value={form.title} onChange={(v: string) => setForm({ ...form, title: v })} required />
    <Field label="Subheading" value={form.description} onChange={(v: string) => setForm({ ...form, description: v })} area required />
    <UploadField label="Background image upload / URL" value={form.backgroundImageUrl} onChange={(v: string) => setForm({ ...form, backgroundImageUrl: v })} upload={upload} />
    <Field label="Button text" value={form.buttonText} onChange={(v: string) => setForm({ ...form, buttonText: v })} required />
    <Field label="Button link" value={form.buttonLink} onChange={(v: string) => setForm({ ...form, buttonLink: v })} required />
  </FormCard>;
}

function ContactSection({ data, run, busy }: any) {
  const c = data.site.contact;
  const [form, setForm] = useState({ phone1: c.phone1 || "", phone2: c.phone2 || "", phone3: c.phone3 || "", whatsapp: c.whatsapp || "", email: c.email || "", address: c.address || "", websiteUrl: c.website_url || "", facebookUrl: c.facebook_url || "", instagramUrl: c.instagram_url || "", tiktokUrl: c.tiktok_url || "", googleMapsEmbedUrl: c.google_maps_embed_url || "" });
  return <FormCard onSubmit={() => run(() => jsonRequest("/api/admin/contact", { method: "PUT", body: JSON.stringify(form) }))} busy={busy}>
    {Object.entries({ phone1: "Phone 1", phone2: "Phone 2", phone3: "Phone 3", whatsapp: "WhatsApp number", email: "Email", address: "Address", websiteUrl: "Website", facebookUrl: "Facebook URL", instagramUrl: "Instagram URL", tiktokUrl: "TikTok URL", googleMapsEmbedUrl: "Google Maps embed URL" }).map(([key, label]) => <Field key={key} label={label} value={(form as any)[key]} onChange={(v: string) => setForm({ ...form, [key]: v })} area={key === "address" || key === "googleMapsEmbedUrl"} required={["phone1", "phone2", "phone3", "whatsapp", "email", "address", "websiteUrl"].includes(key)} />)}
  </FormCard>;
}

function AboutSection({ data, run, busy }: any) {
  const a = data.site.about;
  const [form, setForm] = useState({ title: a.title || "", description: a.description || "", missionStatement: a.mission_statement || "", visionStatement: a.vision_statement || "", happyCustomersCount: a.happy_customers_count || 500, availableVehiclesCount: a.available_vehicles_count || 15, yearsExperience: a.years_experience || 5, supportText: a.support_text || "24/7 Support" });
  return <FormCard onSubmit={() => run(() => jsonRequest("/api/admin/about", { method: "PUT", body: JSON.stringify(form) }))} busy={busy}>
    <Field label="Title" value={form.title} onChange={(v: string) => setForm({ ...form, title: v })} required />
    <Field label="Description" value={form.description} onChange={(v: string) => setForm({ ...form, description: v })} area required />
    <Field label="Mission" value={form.missionStatement} onChange={(v: string) => setForm({ ...form, missionStatement: v })} area />
    <Field label="Vision" value={form.visionStatement} onChange={(v: string) => setForm({ ...form, visionStatement: v })} area />
    <Field label="Happy customers counter" type="number" value={form.happyCustomersCount} onChange={(v: number) => setForm({ ...form, happyCustomersCount: v })} />
    <Field label="Available vehicles counter" type="number" value={form.availableVehiclesCount} onChange={(v: number) => setForm({ ...form, availableVehiclesCount: v })} />
    <Field label="Experience years counter" type="number" value={form.yearsExperience} onChange={(v: number) => setForm({ ...form, yearsExperience: v })} />
    <Field label="Support text" value={form.supportText} onChange={(v: string) => setForm({ ...form, supportText: v })} />
  </FormCard>;
}

function FormCard({ children, onSubmit, busy }: any) {
  return <form className="admin-card admin-form-grid admin-panel" onSubmit={e => { e.preventDefault(); onSubmit(); }}>{children}<div className="full form-actions"><button className="small-btn green" disabled={busy}>{busy ? "Saving..." : "Save"}</button><button className="small-btn" type="reset">Reset</button></div></form>;
}

function VehiclesSection(props: any) {
  return <CrudSection title="Vehicle" rows={props.rows} empty={emptyVehicle} editKey="vehicle" columns={["name", "category", "price_lahore", "price_outside", "active"]} renderForm={(row: any, set: any) => <>
    <Field label="Name" value={row.name} onChange={(v: string) => set({ name: v, slug: row.slug || slugify(v) })} required />
    <Field label="Slug" value={row.slug} onChange={(v: string) => set({ slug: v })} required />
    <Field label="Category" value={row.category} onChange={(v: string) => set({ category: v })} required />
    <UploadField label="Vehicle image upload / URL" value={row.image_url} onChange={(v: string) => set({ image_url: v })} upload={props.upload} />
    <Field label="Lahore price" value={row.price_lahore} onChange={(v: string) => set({ price_lahore: v })} required />
    <Field label="Outside price" value={row.price_outside} onChange={(v: string) => set({ price_outside: v })} required />
    <Field label="Weekly price" value={row.weekly_price} onChange={(v: string) => set({ weekly_price: v })} required />
    <Field label="Monthly price" value={row.monthly_price} onChange={(v: string) => set({ monthly_price: v })} required />
    <Field label="Rating" type="number" value={row.rating} onChange={(v: number) => set({ rating: v })} />
    <Field label="Sort order" type="number" value={row.sort_order} onChange={(v: number) => set({ sort_order: v })} />
    <SelectField label="Active status" value={row.active} onChange={(v: string) => set({ active: v === "true" })}><option value="true">Active</option><option value="false">Inactive</option></SelectField>
    <Field label="Description" value={row.description} onChange={(v: string) => set({ description: v })} area />
    <Field label="Features" value={row.features} onChange={(v: string) => set({ features: v })} area />
  </>} save={(row: any) => props.run(() => jsonRequest(row.id ? `/api/admin/vehicles/${row.id}` : "/api/admin/vehicles", { method: row.id ? "PUT" : "POST", body: JSON.stringify({ name: row.name, slug: row.slug, category: row.category, imageUrl: row.image_url, priceLahore: row.price_lahore, priceOutside: row.price_outside, weeklyPrice: row.weekly_price, monthlyPrice: row.monthly_price, rating: Number(row.rating || 5), description: row.description, features: row.features, active: Boolean(row.active), sortOrder: Number(row.sort_order || 0) }) }))} {...props} />;
}

function PricingSection(props: any) {
  return <CrudSection title="Pricing row" rows={props.rows} empty={emptyPricing} editKey="pricing" columns={["car_type", "destination_city", "one_way_price", "active"]} renderForm={(row: any, set: any) => <>
    <Field label="Car type" value={row.car_type} onChange={(v: string) => set({ car_type: v })} required />
    <Field label="Destination/city" value={row.destination_city} onChange={(v: string) => set({ destination_city: v })} required />
    <Field label="Price" value={row.one_way_price} onChange={(v: string) => set({ one_way_price: v })} required />
    <Field label="Timing note" value={row.timing_note} onChange={(v: string) => set({ timing_note: v })} />
    <SelectField label="Active status" value={row.active} onChange={(v: string) => set({ active: v === "true" })}><option value="true">Active</option><option value="false">Inactive</option></SelectField>
    <Field label="Sort order" type="number" value={row.sort_order} onChange={(v: number) => set({ sort_order: v })} />
  </>} save={(row: any) => props.run(() => jsonRequest(row.id ? `/api/admin/pricing/${row.id}` : "/api/admin/pricing", { method: row.id ? "PUT" : "POST", body: JSON.stringify({ carType: row.car_type, destinationCity: row.destination_city, oneWayPrice: row.one_way_price, timingNote: row.timing_note, active: Boolean(row.active), sortOrder: Number(row.sort_order || 0) }) }))} {...props} />;
}

function CardsSection(props: any) {
  return <CrudSection title="About card" rows={props.rows} empty={emptyCard} editKey="card" columns={["icon", "title", "active"]} renderForm={(row: any, set: any) => <>
    <Field label="Icon" value={row.icon} onChange={(v: string) => set({ icon: v })} />
    <Field label="Title" value={row.title} onChange={(v: string) => set({ title: v })} required />
    <Field label="Description" value={row.description} onChange={(v: string) => set({ description: v })} area required />
    <SelectField label="Active status" value={row.active} onChange={(v: string) => set({ active: v === "true" })}><option value="true">Active</option><option value="false">Inactive</option></SelectField>
    <Field label="Sort order" type="number" value={row.sort_order} onChange={(v: number) => set({ sort_order: v })} />
  </>} save={(row: any) => props.run(() => jsonRequest(row.id ? `/api/admin/about-cards/${row.id}` : "/api/admin/about-cards", { method: row.id ? "PUT" : "POST", body: JSON.stringify({ icon: row.icon, title: row.title, description: row.description, active: Boolean(row.active), sortOrder: Number(row.sort_order || 0) }) }))} {...props} />;
}

function ReviewsSection(props: any) {
  return <CrudSection title="Review" rows={props.rows} empty={emptyReview} editKey="review" columns={["customer_name", "customer_city", "rating", "active"]} renderForm={(row: any, set: any) => <>
    <Field label="Customer name" value={row.customer_name} onChange={(v: string) => set({ customer_name: v })} required />
    <Field label="City" value={row.customer_city} onChange={(v: string) => set({ customer_city: v })} required />
    <Field label="Review text" value={row.review_text} onChange={(v: string) => set({ review_text: v })} area required />
    <Field label="Rating" type="number" value={row.rating} onChange={(v: number) => set({ rating: v })} />
    <Field label="Avatar initials" value={row.avatar_initials} onChange={(v: string) => set({ avatar_initials: v })} />
    <SelectField label="Active status" value={row.active} onChange={(v: string) => set({ active: v === "true" })}><option value="true">Shown</option><option value="false">Hidden</option></SelectField>
    <Field label="Sort order" type="number" value={row.sort_order} onChange={(v: number) => set({ sort_order: v })} />
  </>} save={(row: any) => props.run(() => jsonRequest(row.id ? `/api/admin/reviews/${row.id}` : "/api/admin/reviews", { method: row.id ? "PUT" : "POST", body: JSON.stringify({ customerName: row.customer_name, customerCity: row.customer_city, reviewText: row.review_text, rating: Number(row.rating || 5), avatarInitials: row.avatar_initials, active: Boolean(row.active), sortOrder: Number(row.sort_order || 0) }) }))} {...props} />;
}

function CategoriesSection(props: any) {
  return <CrudSection title="Category" rows={props.rows} empty={emptyCategory} editKey="category" columns={["name", "slug", "active"]} renderForm={(row: any, set: any) => <>
    <Field label="Name" value={row.name} onChange={(v: string) => set({ name: v, slug: row.slug || slugify(v) })} required />
    <Field label="Slug" value={row.slug} onChange={(v: string) => set({ slug: v })} required />
    <Field label="Description" value={row.description} onChange={(v: string) => set({ description: v })} area />
    <SelectField label="Active status" value={row.active} onChange={(v: string) => set({ active: v === "true" })}><option value="true">Active</option><option value="false">Inactive</option></SelectField>
  </>} save={(row: any) => props.run(() => jsonRequest(row.id ? `/api/admin/blog-categories/${row.id}` : "/api/admin/blog-categories", { method: row.id ? "PUT" : "POST", body: JSON.stringify({ name: row.name, slug: row.slug, description: row.description, active: Boolean(row.active) }) }))} {...props} />;
}

function BlogsSection(props: any) {
  return <CrudSection title="Blog" rows={props.rows} empty={emptyBlog} editKey="blog" columns={["title", "slug", "status", "published_date"]} renderForm={(row: any, set: any) => <>
    <Field label="Title" value={row.title} onChange={(v: string) => set({ title: v, slug: row.slug || slugify(v) })} required />
    <Field label="Slug" value={row.slug} onChange={(v: string) => set({ slug: v })} required />
    <Field label="Excerpt" value={row.short_excerpt} onChange={(v: string) => set({ short_excerpt: v })} area />
    <Field label="Content" value={row.full_content} onChange={(v: string) => set({ full_content: v })} area required />
    <UploadField label="Featured image upload / URL" value={row.featured_image_url} onChange={(v: string) => set({ featured_image_url: v })} upload={props.upload} />
    <SelectField label="Category" value={row.category_id || ""} onChange={(v: string) => set({ category_id: v })}><option value="">No category</option>{props.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</SelectField>
    <SelectField label="Status" value={row.status || "draft"} onChange={(v: string) => set({ status: v })}><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option></SelectField>
    <Field label="Published date" type="date" value={valueForDate(row.published_date)} onChange={(v: string) => set({ published_date: v })} />
    <Field label="SEO title" value={row.meta_title} onChange={(v: string) => set({ meta_title: v })} />
    <Field label="SEO description" value={row.meta_description} onChange={(v: string) => set({ meta_description: v })} area />
  </>} save={(row: any) => props.run(() => jsonRequest(row.id ? `/api/admin/blogs/${row.id}` : "/api/admin/blogs", { method: row.id ? "PUT" : "POST", body: JSON.stringify({ title: row.title, slug: row.slug, shortExcerpt: row.short_excerpt, fullContent: row.full_content, featuredImageUrl: row.featured_image_url, categoryId: row.category_id || null, metaTitle: row.meta_title, metaDescription: row.meta_description, publishedDate: row.published_date || null, status: row.status }) }))} {...props} />;
}

function SeoSection(props: any) {
  return <CrudSection title="SEO page" rows={props.rows} empty={emptySeo} editKey="seo" columns={["page_path", "meta_title", "robots_index", "robots_follow"]} renderForm={(row: any, set: any) => <>
    <Field label="Page path" value={row.page_path} onChange={(v: string) => set({ page_path: v, page_name: row.page_name || v })} required />
    <Field label="Page name" value={row.page_name} onChange={(v: string) => set({ page_name: v })} required />
    <Field label="Meta title" value={row.meta_title} onChange={(v: string) => set({ meta_title: v })} />
    <Field label="Meta description" value={row.meta_description} onChange={(v: string) => set({ meta_description: v })} area />
    <Field label="Keywords" value={row.meta_keywords} onChange={(v: string) => set({ meta_keywords: v })} />
    <Field label="Canonical URL" value={row.canonical_url} onChange={(v: string) => set({ canonical_url: v })} />
    <Field label="Open Graph title" value={row.og_title} onChange={(v: string) => set({ og_title: v })} />
    <Field label="Open Graph description" value={row.og_description} onChange={(v: string) => set({ og_description: v })} area />
    <UploadField label="Open Graph image upload / URL" value={row.og_image_url} onChange={(v: string) => set({ og_image_url: v })} upload={props.upload} />
    <Field label="Twitter title" value={row.twitter_title} onChange={(v: string) => set({ twitter_title: v })} />
    <Field label="Twitter description" value={row.twitter_description} onChange={(v: string) => set({ twitter_description: v })} area />
    <UploadField label="Twitter image upload / URL" value={row.twitter_image_url} onChange={(v: string) => set({ twitter_image_url: v })} upload={props.upload} />
    <SelectField label="Robots index" value={row.robots_index} onChange={(v: string) => set({ robots_index: v === "true" })}><option value="true">Index</option><option value="false">No index</option></SelectField>
    <SelectField label="Robots follow" value={row.robots_follow} onChange={(v: string) => set({ robots_follow: v === "true" })}><option value="true">Follow</option><option value="false">No follow</option></SelectField>
    <Field label="Schema JSON-LD" value={typeof row.schema_json_ld === "string" ? row.schema_json_ld : JSON.stringify(row.schema_json_ld || {}, null, 2)} onChange={(v: string) => set({ schema_json_ld: v })} area />
  </>} save={(row: any) => props.run(async () => {
    let schemaJsonLd = {};
    try { schemaJsonLd = typeof row.schema_json_ld === "string" ? JSON.parse(row.schema_json_ld || "{}") : row.schema_json_ld || {}; } catch { throw new Error("Schema JSON-LD must be valid JSON"); }
    await jsonRequest("/api/admin/seo", { method: "POST", body: JSON.stringify({ pageName: row.page_name || row.page_path, pagePath: row.page_path, metaTitle: row.meta_title, metaDescription: row.meta_description, metaKeywords: row.meta_keywords, canonicalUrl: row.canonical_url, ogTitle: row.og_title, ogDescription: row.og_description, ogImageUrl: row.og_image_url, twitterTitle: row.twitter_title, twitterDescription: row.twitter_description, twitterImageUrl: row.twitter_image_url, robotsIndex: Boolean(row.robots_index), robotsFollow: Boolean(row.robots_follow), schemaJsonLd }) });
  })} {...props} />;
}

function CrudSection({ title, rows, empty, editKey, columns, renderForm, save, editing, start, change, run, remove, busy }: any) {
  const draft = editing[editKey];
  const set = (patch: any) => change(editKey, patch);
  return <section className="admin-card admin-panel">
    <div className="admin-section-head"><h2>{title}s</h2><button className="small-btn green" onClick={() => start(editKey, empty)}>Add {title}</button></div>
    {draft && <form className="admin-form-grid crud-form" onSubmit={e => { e.preventDefault(); save(draft); }}>
      {renderForm(draft, set)}
      <div className="full form-actions"><button className="small-btn green" disabled={busy}>{busy ? "Saving..." : "Save"}</button><button className="small-btn" type="button" onClick={() => start(editKey, null)}>Cancel</button></div>
    </form>}
    <DataTable rows={rows} columns={columns} actions={(row: any) => <>
      <button className="small-btn gold" onClick={() => start(editKey, row)}>Edit</button>
      {"active" in row && <button className="small-btn green" onClick={() => run(() => save({ ...row, active: !row.active }), "Updated")}>{row.active ? "Deactivate" : "Activate"}</button>}
      <button className="small-btn danger" onClick={() => remove(`/api/admin/${editKey === "card" ? "about-cards" : editKey === "category" ? "blog-categories" : editKey === "seo" ? "seo" : editKey === "pricing" ? "pricing" : `${editKey}s`}/${row.id}`, title.toLowerCase())}>Delete</button>
    </>} />
  </section>;
}

function DataTable({ rows, columns, actions }: any) {
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{columns.map((c: string) => <th key={c}>{c.replaceAll("_", " ")}</th>)}{actions && <th>Actions</th>}</tr></thead><tbody>{rows.length ? rows.map((row: any, i: number) => <tr key={row.id || i}>{columns.map((c: string) => <td key={c}>{String(row[c] ?? "")}</td>)}{actions && <td>{actions(row)}</td>}</tr>) : <tr><td colSpan={columns.length + (actions ? 1 : 0)}>No records found.</td></tr>}</tbody></table></div>;
}

function BookingsSection({ rows, run, remove, busy }: any) {
  return <section className="admin-card admin-panel"><BookingTable rows={rows} actions={(row: any) => <>
    <select value={row.status} disabled={busy} onChange={e => run(() => jsonRequest(`/api/bookings/${row.id}`, { method: "PATCH", body: JSON.stringify({ status: e.target.value }) }), "Status updated")}><option>New</option><option>Contacted</option><option>Confirmed</option><option>Cancelled</option></select>
    <button className="small-btn danger" onClick={() => remove(`/api/bookings/${row.id}`, "booking")}>Delete</button>
  </>} /></section>;
}

function BookingTable({ rows, actions }: any) {
  return <DataTable rows={rows} columns={["full_name", "phone", "vehicle_name", "pickup_date", "return_date", "pickup_location", "message", "total_estimate", "status", "created_at"]} actions={actions} />;
}

function UploadedFiles({ rows }: any) {
  return <section className="admin-card admin-panel"><DataTable rows={rows.map((f: any) => ({ ...f, preview: f.file_type?.startsWith("image/") ? "Image" : "" }))} columns={["file_name", "file_url", "file_type", "file_size", "created_at"]} actions={(row: any) => <>
    {row.file_type?.startsWith("image/") && <img className="file-thumb" src={row.file_url} alt="" />}
    <button className="small-btn gold" onClick={() => navigator.clipboard?.writeText(row.file_url)}>Copy URL</button>
    <a className="small-btn" href={row.file_url} target="_blank">Open</a>
  </>} /></section>;
}
