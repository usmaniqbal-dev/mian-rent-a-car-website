"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteData } from "@/lib/site-data";

function waNumber(phone: string) {
  let n = String(phone || "").replace(/\D/g, "");
  if (n.startsWith("0")) n = `92${n.slice(1)}`;
  return n;
}

function waLink(phone: string, message = "") {
  return `https://wa.me/${waNumber(phone)}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

function parseAmount(text: string) {
  const match = String(text || "").replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function calculateDays(start: string, end: string) {
  if (!start || !end) return 0;
  const pickup = new Date(start);
  const returning = new Date(end);
  if (Number.isNaN(pickup.getTime()) || Number.isNaN(returning.getTime())) return 0;
  return Math.max(1, Math.ceil((returning.getTime() - pickup.getTime()) / 86400000) + 1);
}

function stars(rating: number) {
  return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
}

export default function PublicSite({ data }: { data: SiteData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [booking, setBooking] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "error" } | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", pickupDate: "", returnDate: "", pickupLocation: "", message: "" });
  const contact = data.contact;
  const phones = [contact.phone1, contact.phone2, contact.phone3].filter(Boolean);
  const vehicles = useMemo(() => data.vehicles.filter(v => filter === "All" || v.category === filter), [data.vehicles, filter]);
  const days = calculateDays(form.pickupDate, form.returnDate);
  const total = booking ? days * parseAmount(booking.price_lahore) : 0;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function submitBooking(event: React.FormEvent) {
    event.preventDefault();
    if (!booking) return;
    if (!form.fullName || !form.phone || !form.pickupDate || !form.returnDate || !form.pickupLocation) {
      setToast({ message: "Please fill all required booking fields.", type: "error" });
      return;
    }
    try {
      setSubmitting(true);
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: booking.id,
          vehicleName: booking.name,
          fullName: form.fullName,
          phone: form.phone,
          pickupDate: form.pickupDate,
          returnDate: form.returnDate,
          pickupLocation: form.pickupLocation,
          message: form.message,
          totalEstimate: total
        })
      });
      if (!response.ok) throw new Error("Booking could not be saved");
      const msg = `Hello! I want to book ${booking.name} from ${form.pickupDate} to ${form.returnDate}.\nName: ${form.fullName}\nPhone: ${form.phone}\nLocation: ${form.pickupLocation}\nTotal Estimate: Rs. ${total.toLocaleString("en-PK")}\nMessage: ${form.message || "-"}\nPlease confirm.`;
      window.open(waLink(contact.whatsapp, msg), "_blank");
      setToast({ message: "Booking saved. WhatsApp is opening now." });
      setBooking(null);
    } catch {
      setToast({ message: "Booking could not be saved. Please try WhatsApp or call us.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#home"><span className="brand-mark">{data.logo.image_url ? <SafeImage src={data.logo.image_url} alt={data.logo.logo_text} fallback="🚘" /> : "🚘"}</span><span>{data.logo.logo_text}</span></a>
          <nav className="nav-links">
            {["Home", "Vehicles", "Pricing", "About", "Blogs", "Contact"].map(label => <a key={label} className="nav-link" href={label === "Blogs" ? "/blogs" : `#${label.toLowerCase()}`}>{label}</a>)}
          </nav>
          <a className="wa-btn" href={waLink(contact.whatsapp, "Hello Mian Rent A Car, I want to ask about car rental.")}>💬 WhatsApp</a>
          <button className="menu-toggle" onClick={() => setMenuOpen(true)}>☰</button>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>×</button>
        <nav>{["Home", "Vehicles", "Pricing", "About", "Blogs", "Contact"].map(label => <a key={label} href={label === "Blogs" ? "/blogs" : `#${label.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
      </div>

      <main>
        <section className="hero" id="home" style={{ ["--hero-bg" as string]: data.hero.background_image_url ? `url(${data.hero.background_image_url})` : "radial-gradient(circle at 72% 42%, rgba(245,192,0,.24), transparent 20%)" }}>
          <div className="container hero-content">
            <span className="eyebrow">{data.logo.brand_name} Lahore</span>
            <h1>{data.hero.title}</h1>
            <p>{data.hero.description}</p>
            <div className="hero-actions"><a className="gold-btn" href={data.hero.button_link}>{data.hero.button_text}</a><button className="outline-btn" onClick={() => setWaOpen(true)}>Call Us</button></div>
          </div>
          <a className="scroll-cue" href="#vehicles" />
        </section>

        <section className="section-pad" id="vehicles">
          <div className="container">
            <div className="center"><span className="eyebrow">Our Fleet</span><h2 className="section-title">Vehicles for Every Journey</h2><p className="section-sub">Choose from clean sedans, family SUVs, luxury vehicles, vans, and group travel options with flexible packages.</p></div>
            <div className="filter-bar">{["All", "Sedan", "SUV", "Van", "Luxury"].map(c => <button key={c} className={`filter-tab ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>)}</div>
            {vehicles.length === 0 && <div className="admin-card" style={{ padding: 24, textAlign: "center" }}>Vehicles will appear here after the database is seeded.</div>}
            <div className="vehicle-grid">{vehicles.map(v => <article className="vehicle-card" key={v.id}><div className="vehicle-image">{v.image_url ? <SafeImage src={v.image_url} alt={`${v.name} rent a car Lahore`} fallback="🚘" /> : <div className="image-fallback">🚘</div>}</div><div className="vehicle-body"><div className="vehicle-head"><h3 className="vehicle-name">{v.name}</h3><span className="pill">{v.category}</span></div><div className="prices"><div className="price-box"><span className="price-label">Lahore</span><span className="price-value">{v.price_lahore}</span></div><div className="price-box"><span className="price-label">Outside</span><span className="price-value">{v.price_outside}</span></div><div className="price-box"><span className="price-label">Weekly</span><span className="price-value">{v.weekly_price}</span></div><div className="price-box"><span className="price-label">Monthly</span><span className="price-value">{v.monthly_price}</span></div></div><div className="rating">{stars(v.rating)}</div><button className="book-btn" onClick={() => setBooking(v)}>Book Now</button></div></article>)}</div>
          </div>
        </section>

        <section className="section-pad" id="pricing"><div className="container"><div className="center"><span className="eyebrow">Travel Rates</span><h2 className="section-title">Intercity Travel Rates</h2><p className="section-sub">One-way rates from Lahore</p></div><div className="pricing-wrap"><table className="rate-table"><thead><tr><th>Car Type</th><th>Destination</th><th>One-Way Rate</th></tr></thead><tbody>{data.pricing.length ? data.pricing.map(r => <tr key={r.id}><td>{r.car_type}</td><td>{r.destination_city}</td><td><strong>{r.one_way_price}</strong></td></tr>) : <tr><td colSpan={3}>Pricing will appear here after the database is seeded.</td></tr>}</tbody></table><div className="rate-note">*Timing: {data.pricing[0]?.timing_note || "24 hours, within the same date"}</div></div></div></section>

        <section className="section-pad why" id="about"><div className="container"><div className="center"><span className="eyebrow">Why Choose Us</span><h2 className="section-title">{data.about.title}</h2><p className="section-sub">{data.about.description}</p><p className="section-sub"><strong>Mission:</strong> {data.about.mission_statement}<br /><strong>Vision:</strong> {data.about.vision_statement}</p></div><div className="why-grid">{data.aboutCards.map(c => <article className="why-card" key={c.id}><div className="big">{c.icon}</div><h3>{c.title}</h3><p>{c.description}</p></article>)}</div><div className="counter-row"><div className="counter-box"><strong>{data.about.happy_customers_count}+</strong><span>Happy Customers</span></div><div className="counter-box"><strong>{data.about.available_vehicles_count}</strong><span>Vehicles Available</span></div><div className="counter-box"><strong>{data.about.years_experience}+</strong><span>Years Experience</span></div><div className="counter-box"><strong>24/7</strong><span>{data.about.support_text}</span></div></div></div></section>

        <section className="section-pad" id="reviews"><div className="container"><div className="center"><span className="eyebrow">Customer Reviews</span><h2 className="section-title">What Our Customers Say</h2></div><div className="reviews-row">{data.reviews.map(r => <article className="review-card" key={r.id}><div className="rating">{stars(r.rating)}</div><p>"{r.review_text}"</p><div className="review-author"><div className="avatar">{r.avatar_initials}</div><div><strong>{r.customer_name}</strong><span>{r.customer_city}</span></div></div></article>)}</div></div></section>

        <section className="section-pad contact" id="contact"><div className="container"><div className="center"><span className="eyebrow">Contact</span><h2 className="section-title">Book Your Car Today</h2></div><div className="contact-grid"><div className="info-panel"><h3>{data.logo.logo_text}</h3><div className="contact-list"><div className="contact-line">📍 <div><b>Address</b><br />{contact.address}</div></div>{phones.map(p => <a className="contact-line" href={`tel:${p}`} key={p}>📞 <div><b>{p}</b><br />Tap to call</div></a>)}<a className="contact-line" href={`mailto:${contact.email}`}>✉️ <div><b>{contact.email}</b><br />Email us anytime</div></a></div><div className="social-row"><a href={contact.facebook_url || "#"}>f</a><a href={contact.instagram_url || "#"}>◎</a><a href={contact.tiktok_url || "#"}>♪</a><a href={waLink(contact.whatsapp)}>💬</a></div><iframe className="map-frame" title="Wapda Town Lahore map" src={contact.google_maps_embed_url} /></div><ContactForm vehicles={data.vehicles} contact={contact} /></div></div></section>
      </main>

      <footer className="footer"><div className="container"><div className="footer-grid"><div><h3>{data.logo.logo_text}</h3><p>{data.logo.brand_name} provides premium car rental services with reliable vehicles, expert drivers, and flexible packages across Lahore and Pakistan.</p></div><div><h4>Quick Links</h4><div className="footer-links"><a href="#home">Home</a><a href="#vehicles">Vehicles</a><a href="#pricing">Pricing</a><a href="#about">About</a><a href="/blogs">Blogs</a><a href="#contact">Contact</a></div></div><div><h4>Contact</h4><p>{contact.address}</p>{phones.map(p => <p key={p}>{p}</p>)}<p>{contact.email}</p></div></div><div className="footer-bottom">© 2025 Mian Rent A Car (CarMian®). All Rights Reserved.</div></div></footer>

      <button className="float-wa" onClick={() => setWaOpen(true)}>💬<span className="float-tooltip">Need Help? Chat with us</span></button>
      <div className={`popup-backdrop ${waOpen || booking ? "open" : ""}`} onClick={() => { setWaOpen(false); setBooking(null); }} />
      <div className={`wa-popup ${waOpen ? "open" : ""}`}><div className="popup-head"><h3>Contact Mian Rent A Car</h3><button className="x-btn" onClick={() => setWaOpen(false)}>×</button></div>{phones.map(p => <div className="phone-row" key={p}><div className="phone-main">📞 <strong>{p}</strong></div><div className="phone-actions"><a className="mini-btn mini-call" href={`tel:${p}`}>📞 Call</a><a className="mini-btn mini-wa" href={waLink(p, "Hello Mian Rent A Car, I need help with car rental.")}>💬 WhatsApp</a></div></div>)}</div>
      <div className={`booking-modal ${booking ? "open" : ""}`}><div className="modal-head"><h3>Book Vehicle</h3><button className="x-btn" onClick={() => setBooking(null)}>×</button></div>{booking && <form className="form-grid" onSubmit={submitBooking}><div className="field"><label>Vehicle</label><input value={booking.name} readOnly /></div><div className="two-col"><div className="field"><label>Full Name</label><input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div><div className="field"><label>Phone Number</label><input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div></div><div className="two-col"><div className="field"><label>Pickup Date</label><input type="date" required value={form.pickupDate} onChange={e => setForm({ ...form, pickupDate: e.target.value })} /></div><div className="field"><label>Return Date</label><input type="date" required value={form.returnDate} onChange={e => setForm({ ...form, returnDate: e.target.value })} /></div></div><div className="field"><label>Pickup Location</label><input required value={form.pickupLocation} onChange={e => setForm({ ...form, pickupLocation: e.target.value })} /></div><div className="field"><label>Message</label><textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div><div className="estimate">Total Estimate: Rs. {total.toLocaleString("en-PK")}</div><div className="modal-actions"><button className="cancel-btn" type="button" onClick={() => setBooking(null)}>Cancel</button><button className="primary-btn" type="submit" disabled={submitting}>{submitting ? "Saving..." : "Send via WhatsApp"}</button></div></form>}</div>
      {toast && <div className={`toast ${toast.type || ""}`}>{toast.message}</div>}
    </>
  );
}

function ContactForm({ vehicles, contact }: { vehicles: any[]; contact: any }) {
  const [state, setState] = useState({ name: "", phone: "", vehicle: vehicles[0]?.name || "", date: "", message: "" });
  return <form className="contact-form form-grid" onSubmit={e => { e.preventDefault(); window.open(waLink(contact.whatsapp, `Hello! I want information about ${state.vehicle}. Name: ${state.name}, Phone: ${state.phone}, Date: ${state.date}. Message: ${state.message}`), "_blank"); }}><div className="field"><label>Name</label><input required value={state.name} onChange={e => setState({ ...state, name: e.target.value })} /></div><div className="field"><label>Phone</label><input required value={state.phone} onChange={e => setState({ ...state, phone: e.target.value })} /></div><div className="field"><label>Vehicle Interest</label><select value={state.vehicle} onChange={e => setState({ ...state, vehicle: e.target.value })}>{vehicles.map(v => <option key={v.id}>{v.name}</option>)}</select></div><div className="field"><label>Date</label><input type="date" required value={state.date} onChange={e => setState({ ...state, date: e.target.value })} /></div><div className="field"><label>Message</label><textarea required value={state.message} onChange={e => setState({ ...state, message: e.target.value })} /></div><button className="dark-submit" type="submit">Send Message</button></form>;
}

function SafeImage({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="image-fallback">{fallback}</div>;
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
