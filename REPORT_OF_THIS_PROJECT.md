# Mian Rent A Car / CarMian Project Technical Report

## 1. Project Overview

This project started as a complete single-file `index.html` website for Mian Rent A Car / CarMian in Lahore, Pakistan. The original website included the full public frontend, booking modal, WhatsApp popup, contact form, vehicle cards, pricing table, reviews, footer, and an admin overlay that saved content in `localStorage`.

The project was then converted into a production-style Next.js application. The new structure keeps the same visual style and layout direction from the original frontend, but moves the main website data into PostgreSQL and prepares Vercel Blob for image uploads.

The current project contains both:

- `index.html`: the original single-file website and visual reference.
- Next.js app files: the newer production-style full-stack version.

Important status: the project has a strong production foundation, but it is not fully production-complete yet. Some admin sections are API-ready but still need full interactive React CRUD forms in the admin UI.

## 2. Tech Stack Used

Frontend:

- Next.js App Router
- React
- TypeScript
- CSS in `app/globals.css`
- Existing visual design preserved from the original `index.html`

Backend:

- Next.js API Routes
- Node.js runtime
- Server-side data loading

Database:

- PostgreSQL / Vercel Postgres
- SQL schema in `db/schema.sql`
- Seed script in `db/seed.ts`

Storage:

- Vercel Blob / Vercel Storage
- Upload route in `app/api/upload/route.ts`

Authentication:

- bcrypt password hashing
- JWT session token
- HTTP-only cookie

Deployment target:

- Vercel

## 3. Frontend Working

The public frontend is now handled mainly by:

- `app/page.tsx`
- `components/PublicSite.tsx`
- `app/globals.css`
- `lib/site-data.ts`

The public website loads data from PostgreSQL through server-side database queries. It renders:

- Sticky header
- Logo
- Navigation
- Hero section
- Vehicle filters
- Vehicle cards
- Booking modal
- Pricing table
- About / Why Choose Us section
- Reviews
- Contact section
- Google Maps iframe
- WhatsApp floating popup
- Footer

The visual styling is stored in `app/globals.css`. This file was written to match the original black, white, WhatsApp green, and gold design system.

Current limitation:

- The new React frontend matches the same design language and section structure, but it is not a pixel-perfect conversion of every animation and minor detail from `index.html`.
- Animated counters are currently rendered as values, not fully animated like the original single-file version.

## 4. Admin Panel Working

The production admin route is:

```text
/admin
```

The old hash route:

```text
#admin1234
```

is handled in `app/layout.tsx` with a browser-side redirect to `/admin`.

Admin login:

- Username: `ADMIN1`
- Password: `ADMIN1`
- Password is seeded as a bcrypt hash, not plain text.

Admin panel file:

```text
app/admin/page.tsx
```

Current admin status:

- Login page exists.
- Dashboard exists.
- Admin session is checked server-side.
- Admin can view summary data, vehicle rows, bookings, blogs, and SEO rows.
- Protected API routes exist for CRUD operations.

Current limitation:

- Several admin sections show placeholder panels instead of complete interactive add/edit/delete forms.
- The backend APIs are ready, but the admin UI still needs full React forms wired to those APIs for a complete production CMS experience.

## 5. PostgreSQL Storage Report

PostgreSQL is the main permanent storage layer.

Schema file:

```text
db/schema.sql
```

Seed file:

```text
db/seed.ts
```

Stored in PostgreSQL:

- Admin users
- Site settings
- Hero section
- Logo details
- Contact details
- Vehicles
- Pricing rates
- About content
- About cards
- Customer reviews
- Bookings
- Blogs
- Blog categories
- SEO settings
- Uploaded file records

Data remains after:

- Browser refresh
- Browser close
- Deployment/redeploy
- Admin logout

Data will remain as long as the connected PostgreSQL database is not reset or deleted.

## 6. Vercel Blob / Vercel Storage Report

Vercel Blob integration exists in:

```text
lib/storage.ts
app/api/upload/route.ts
```

Purpose:

- Upload images from the admin panel.
- Store files publicly in Vercel Blob.
- Save uploaded file metadata in the `uploaded_files` PostgreSQL table.

Supported intended uploads:

- Hero background image
- Logo image
- Vehicle images
- Blog featured images
- Open Graph images
- Other admin-managed images

Current status:

- Backend upload route exists.
- File type validation exists.
- File size validation exists.
- Uploaded file database record is created.

Current limitation:

- The admin UI does not yet include file picker controls connected to `/api/upload`.

## 7. localStorage Check

Original `index.html`:

- Uses `localStorage` for admin changes.
- This is still present because the original file remains as a reference and standalone version.

Next.js production version:

- Does not use `localStorage` for main website content.
- Website content is read from PostgreSQL.
- Admin authentication uses cookies, not `localStorage`.

Report conclusion:

- `localStorage` is no longer used as the production content database.
- The old `index.html` still contains localStorage logic, but that file is not the production Next.js data source.

## 8. Cookies / Session Storage

Authentication files:

```text
lib/auth.ts
app/api/auth/login/route.ts
app/api/auth/logout/route.ts
app/api/auth/me/route.ts
```

Session method:

- User logs in with username and password.
- Password is checked against bcrypt hash.
- A JWT is created.
- JWT is stored in an HTTP-only cookie.
- Admin routes check this cookie server-side.

Cookie properties:

- `httpOnly: true`
- `sameSite: lax`
- `secure: true` in production
- Max age: 8 hours

This is better than storing admin credentials or tokens in frontend JavaScript.

## 9. File-by-File Explanation

### `index.html`

- Purpose: Original complete single-file website.
- What it does: Contains the old public website, admin overlay, localStorage mock database, WhatsApp popup, booking modal, and all inline CSS/JS.
- Which API it calls: None.
- Which database table it uses: None.
- Possible issue: Still uses `localStorage`, so it is not production data storage.
- Suggested fix: Keep as visual reference only, or archive it after the Next.js version is fully verified.

### `package.json`

- Purpose: Defines the Next.js project dependencies and scripts.
- What it does: Adds scripts for dev, build, start, lint, and database seeding.
- Which API it calls: None.
- Which database table it uses: None.
- Possible issue: Dependencies must be installed before build.
- Suggested fix: Run `npm install`, then `npm run build`.

### `.env.example`

- Purpose: Shows required environment variables.
- What it does: Documents `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`, and `NEXT_PUBLIC_SITE_URL`.
- Which API it calls: None.
- Which database table it uses: None.
- Possible issue: Real `.env.local` is still required.
- Suggested fix: Copy to `.env.local` and add real values.

### `README.md`

- Purpose: Setup and deployment guide.
- What it does: Explains local setup, admin login, API routes, database seed, and Vercel deployment.
- Which API it calls: None.
- Which database table it uses: None.
- Possible issue: Needs to be updated if admin UI becomes fully interactive.
- Suggested fix: Keep README updated with actual deployment steps.

### `app/layout.tsx`

- Purpose: Root layout for the Next.js app.
- What it does: Loads global CSS, sets metadata base, and redirects `#admin1234` to `/admin` in the browser.
- Which API it calls: None.
- Which database table it uses: None.
- Possible issue: Hash redirects cannot happen server-side because URL hashes are not sent to the server.
- Suggested fix: Current browser-side redirect is the correct fallback.

### `app/globals.css`

- Purpose: Main styling file.
- What it does: Recreates the original website look: header, hero, vehicle cards, pricing table, admin layout, forms, modals, WhatsApp popup, responsive breakpoints.
- Which API it calls: None.
- Which database table it uses: None.
- Possible issue: It is a large CSS file.
- Suggested fix: Later split into section CSS modules only if design remains unchanged.

### `app/page.tsx`

- Purpose: Public homepage.
- What it does: Fetches site data server-side and renders `PublicSite`.
- Which API it calls: None directly; uses server-side DB helper.
- Which database table it uses: Through `lib/site-data.ts`, it reads hero, logo, contact, vehicles, pricing, about, about cards, and reviews.
- Possible issue: If database is not seeded, page may fail because required rows are missing.
- Suggested fix: Add defensive fallback data or enforce seed before deployment.

### `components/PublicSite.tsx`

- Purpose: Main public frontend component.
- What it does: Renders header, hero, vehicles, booking modal, pricing, about, reviews, contact, footer, WhatsApp popup, and contact form.
- Which API it calls:
  - `POST /api/bookings`
- Which database table it uses:
  - Reads data passed from `lib/site-data.ts`.
  - Saves bookings to `bookings` through the API.
- Possible issue: This is a large client component.
- Suggested fix: Split into smaller components such as `Header`, `Hero`, `VehiclesSection`, `BookingModal`, and `Footer`.

### `lib/site-data.ts`

- Purpose: Server-side site data loader.
- What it does: Queries all public content needed for homepage rendering.
- Which API it calls: None.
- Which database table it uses:
  - `hero_sections`
  - `logos`
  - `contact_info`
  - `vehicles`
  - `pricing_rates`
  - `about_content`
  - `about_cards`
  - `customer_reviews`
- Possible issue: Assumes seeded rows exist.
- Suggested fix: Add fallback defaults for empty tables.

### `lib/db.ts`

- Purpose: Database helper.
- What it does: Exports Vercel Postgres `sql`, helper `one`, `slugify`, and `parsePrice`.
- Which API it calls: None.
- Which database table it uses: Any table through imported `sql`.
- Possible issue: Thin helper only.
- Suggested fix: Add typed repository functions for larger production maintainability.

### `lib/auth.ts`

- Purpose: Authentication and session helper.
- What it does: Hashes passwords, verifies passwords, creates JWT sessions, sets/clears HTTP-only cookies, checks admin from request.
- Which API it calls: None.
- Which database table it uses:
  - `admins`
- Possible issue: No CSRF token implementation yet.
- Suggested fix: Add CSRF protection for state-changing admin forms/API calls.

### `lib/validations.ts`

- Purpose: Input validation schemas.
- What it does: Defines Zod schemas for login, hero, logo, contact, vehicle, booking, and booking status.
- Which API it calls: None.
- Which database table it uses: None directly.
- Possible issue: Not every API route uses a strict Zod schema yet.
- Suggested fix: Add Zod validation to pricing, blogs, SEO, reviews, and about APIs.

### `lib/storage.ts`

- Purpose: Vercel Blob upload helper.
- What it does: Validates image type/size, uploads to Vercel Blob, saves metadata.
- Which API it calls: Vercel Blob SDK.
- Which database table it uses:
  - `uploaded_files`
- Possible issue: Admin UI upload controls are not fully wired yet.
- Suggested fix: Add reusable upload component in admin forms.

### `lib/seo.ts`

- Purpose: SEO metadata helper.
- What it does: Loads SEO settings by path and returns Next.js metadata.
- Which API it calls: None.
- Which database table it uses:
  - `seo_settings`
- Possible issue: Schema JSON-LD is stored but not fully injected everywhere yet.
- Suggested fix: Add JSON-LD rendering in layout/page components.

### `db/schema.sql`

- Purpose: Full PostgreSQL schema.
- What it does: Creates all requested tables and indexes.
- Which API it calls: None.
- Which database table it uses: Creates all tables.
- Possible issue: No migration versioning system yet.
- Suggested fix: Add migration tool or versioned migration files.

### `db/seed.ts`

- Purpose: Seed database with current website data.
- What it does: Creates schema, hashes `ADMIN1`, inserts hero, logo, contact, vehicles, pricing, about content, reviews, blog category, and SEO rows.
- Which API it calls: None.
- Which database table it uses:
  - All major content tables.
- Possible issue: It deletes and reseeds content for several tables.
- Suggested fix: For production, use careful idempotent seed or migration scripts that do not wipe live content.

### `app/admin/page.tsx`

- Purpose: Admin dashboard page.
- What it does: Shows login if not authenticated; shows dashboard, summary tables, and placeholder admin sections if authenticated.
- Which API it calls:
  - Login form posts to `/api/auth/login`.
  - Logout uses server action to clear cookie.
- Which database table it uses:
  - `vehicles`
  - `bookings`
  - `blogs`
  - `seo_settings`
  - `admins` through auth helper.
- Possible issue: Full CRUD forms are not fully built in UI.
- Suggested fix: Create React admin forms for each section and connect them to the protected CRUD APIs.

### `app/blogs/page.tsx`

- Purpose: Public blog listing page.
- What it does: Lists published blog posts.
- Which API it calls: None.
- Which database table it uses:
  - `blogs`
  - `blog_categories`
- Possible issue: Empty state is not designed.
- Suggested fix: Add a professional empty blog state.

### `app/blogs/[slug]/page.tsx`

- Purpose: Public blog detail page.
- What it does: Shows one published blog by slug, metadata, content, related blogs, WhatsApp CTA.
- Which API it calls: None.
- Which database table it uses:
  - `blogs`
  - `blog_categories`
- Possible issue: Uses `dangerouslySetInnerHTML` for blog content.
- Suggested fix: Sanitize blog HTML before saving and before rendering.

### `app/sitemap.ts`

- Purpose: Dynamic sitemap.
- What it does: Adds home, blogs page, and all published blog posts.
- Which API it calls: None.
- Which database table it uses:
  - `blogs`
- Possible issue: Only blogs are dynamic right now.
- Suggested fix: Add future dynamic vehicle/service pages if created.

### `app/robots.ts`

- Purpose: Robots configuration.
- What it does: Allows public pages and disallows `/admin`.
- Which API it calls: None.
- Which database table it uses: None.
- Possible issue: None major.
- Suggested fix: Add environment-specific noindex for staging deployments.

### `app/not-found.tsx`

- Purpose: Custom 404 page.
- What it does: Shows simple branded not-found page.
- Which API it calls: None.
- Which database table it uses: None.
- Possible issue: Basic design.
- Suggested fix: Add contact/WhatsApp CTA.

## 10. API Routes Explanation

### `app/api/auth/login/route.ts`

- Purpose: Admin login.
- What it does: Accepts username/password, verifies bcrypt hash, creates HTTP-only cookie session.
- Database table: `admins`
- Possible issue: No login rate limiting yet.
- Suggested fix: Add IP-based rate limiting.

### `app/api/auth/logout/route.ts`

- Purpose: Admin logout.
- What it does: Clears session cookie.
- Database table: None.
- Possible issue: None major.
- Suggested fix: Add CSRF protection for logout.

### `app/api/auth/me/route.ts`

- Purpose: Check current admin.
- What it does: Reads session cookie and returns admin if valid.
- Database table: `admins`
- Possible issue: None major.

### `app/api/site/route.ts`

- Purpose: Public site data endpoint.
- What it does: Returns active public content.
- Database tables: hero, logo, contact, vehicles, pricing, about, about cards, reviews.
- Possible issue: Could expose more fields than needed.
- Suggested fix: Select exact public columns.

### `app/api/bookings/route.ts`

- Purpose: Booking creation and admin booking list.
- What it does:
  - Public `POST` saves booking.
  - Protected `GET` lists bookings.
- Database table: `bookings`
- Possible issue: No booking rate limit yet.
- Suggested fix: Add rate limiting and spam checks.

### `app/api/bookings/[id]/route.ts`

- Purpose: Update booking status.
- What it does: Allows admin to set booking status.
- Database table: `bookings`
- Possible issue: Only status update exists.
- Suggested fix: Add full booking notes/contact history if needed.

### `app/api/upload/route.ts`

- Purpose: Image upload.
- What it does: Uploads image to Vercel Blob and saves metadata.
- Database table: `uploaded_files`
- Possible issue: Admin UI upload controls are not finished.
- Suggested fix: Add upload field in hero, logo, vehicle, blog, and SEO image forms.

### Admin content APIs

These routes are protected by admin session:

- `app/api/admin/hero/route.ts`
- `app/api/admin/logo/route.ts`
- `app/api/admin/contact/route.ts`
- `app/api/admin/vehicles/route.ts`
- `app/api/admin/vehicles/[id]/route.ts`
- `app/api/admin/pricing/route.ts`
- `app/api/admin/pricing/[id]/route.ts`
- `app/api/admin/about/route.ts`
- `app/api/admin/about-cards/route.ts`
- `app/api/admin/about-cards/[id]/route.ts`
- `app/api/admin/reviews/route.ts`
- `app/api/admin/reviews/[id]/route.ts`
- `app/api/admin/blogs/route.ts`
- `app/api/admin/blogs/[id]/route.ts`
- `app/api/admin/blog-categories/route.ts`
- `app/api/admin/seo/route.ts`

What they do:

- Create, update, delete, or list admin-managed content.
- Use parameterized SQL through Vercel Postgres.
- Require admin session.

Possible issue:

- Some routes use raw `await req.json()` without full Zod validation.

Suggested fix:

- Add complete Zod schemas for every route.

## 11. Database Tables Explanation

### `admins`

Stores admin users and bcrypt password hashes.

### `site_settings`

Generic JSON settings table. Currently available for future settings.

### `hero_sections`

Stores hero title, description, background image, button text, and button link.

### `logos`

Stores logo image URL, logo text, and brand name.

### `contact_info`

Stores phone numbers, WhatsApp, email, address, website URL, social links, and Google Maps embed URL.

### `vehicles`

Stores vehicle name, slug, category, image URL, prices, rating, description, features, active status, and sort order.

### `pricing_rates`

Stores intercity pricing rows, car type, destination, price, timing note, active status, and sort order.

### `about_content`

Stores About section title, description, mission, vision, counters, and support text.

### `about_cards`

Stores Why Choose Us cards with icon, title, description, active status, and sort order.

### `customer_reviews`

Stores customer reviews with name, city, text, rating, avatar initials, active status, and sort order.

### `bookings`

Stores booking submissions from the public booking modal.

### `blogs`

Stores blog posts with SEO fields, status, content, featured image, category, and publishing details.

### `blog_categories`

Stores blog category names, slugs, descriptions, and active status.

### `seo_settings`

Stores page-level metadata, keywords, canonical URLs, OG/Twitter metadata, robots options, schema JSON-LD, and extra head scripts.

### `uploaded_files`

Stores uploaded file URL, name, type, size, uploaded admin, and created date.

## 12. Blog System Explanation

Public blog routes:

- `/blogs`
- `/blogs/[slug]`

Admin blog APIs:

- `/api/admin/blogs`
- `/api/admin/blogs/[id]`
- `/api/admin/blog-categories`

Blog data stored in:

- `blogs`
- `blog_categories`

Current blog features:

- Blog listing page
- Blog detail page
- Published blog filtering
- Metadata generation
- Related blog links
- WhatsApp CTA
- Blog category support

Current limitations:

- Admin blog editor UI is not fully interactive yet.
- Blog HTML sanitization is still needed.
- Scheduling logic is partly represented by database fields but needs admin UI controls.

## 13. SEO System Explanation

SEO files:

- `lib/seo.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/blogs/[slug]/page.tsx`
- `app/blogs/page.tsx`

SEO table:

- `seo_settings`

Implemented:

- Dynamic metadata helper
- Sitemap
- Robots
- Blog metadata
- Canonical support
- Open Graph fields
- Twitter card fields in helper
- Seeded SEO data for home and blogs

Current limitations:

- JSON-LD schema storage exists but schema rendering is not fully implemented across all pages.
- SEO admin UI is a table/placeholder, not a full editing panel yet.

## 14. Booking System Explanation

Booking flow:

1. User clicks Book Now on a vehicle.
2. Booking modal opens.
3. User enters name, phone, pickup date, return date, pickup location, and message.
4. Total estimate is calculated from days x Lahore daily price.
5. On submit, booking is saved to PostgreSQL.
6. WhatsApp opens with booking details.

Files:

- `components/PublicSite.tsx`
- `app/api/bookings/route.ts`
- `app/api/bookings/[id]/route.ts`

Database table:

- `bookings`

Admin can view bookings in:

- `app/admin/page.tsx`

Current limitation:

- Admin can view bookings and API can update status, but the admin UI status dropdown/button is not fully built.

## 15. What is Editable from Admin Panel

Backend APIs support editing:

- Hero section
- Logo
- Contact / WhatsApp information
- Vehicles
- Pricing rates
- About content
- About cards
- Customer reviews
- Blogs
- Blog categories
- SEO settings
- Booking statuses
- Uploaded images

Current UI status:

- Admin dashboard exists.
- Some data tables are visible.
- Full CRUD APIs exist.
- Full admin form UI is not complete for every section.

## 16. What is Stored Permanently

Stored permanently in PostgreSQL:

- Admin login hash
- Hero data
- Logo data
- Contact data
- Vehicles
- Pricing
- About content
- About cards
- Reviews
- Bookings
- Blogs
- Blog categories
- SEO settings
- Uploaded file records

Stored permanently in Vercel Blob:

- Uploaded images/files

Stored in browser cookie:

- Admin session token

Not permanently stored in browser:

- Main website content in the Next.js version

## 17. What is Still Static / Hardcoded

Still static or partly hardcoded:

- Some frontend labels like section headings.
- Some footer text.
- Vehicle category filter labels: All, Sedan, SUV, Van, Luxury.
- WhatsApp/contact UI labels.
- Admin section placeholder text.
- Default admin username/password in seed script.
- Some SEO fallback text.
- Blog page layout text.

Original `index.html` remains static and localStorage-based.

## 18. Missing Features if Any

Missing or incomplete features:

- Full interactive admin CRUD forms for every section.
- Admin image upload UI connected to Vercel Blob.
- Blog rich text editor.
- Blog HTML sanitization.
- CSRF protection.
- Login and booking rate limiting.
- Full SEO editor UI.
- JSON-LD rendering from database.
- Admin booking status controls in UI.
- Full build/test verification after dependency installation.
- Pixel-perfect comparison against original `index.html`.
- Production migration versioning.

## 19. Security Report

Implemented:

- Password hashing with bcrypt.
- HTTP-only session cookie.
- Secure cookie enabled in production.
- JWT session expiry.
- Admin route protection helpers.
- Parameterized SQL through Vercel Postgres template queries.
- File upload type validation.
- File upload size validation.
- No production content stored in localStorage.

Needs improvement:

- Add CSRF protection for state-changing routes.
- Add login rate limiting.
- Add booking rate limiting.
- Add stricter Zod validation to all API routes.
- Sanitize blog HTML.
- Add admin audit logs.
- Add role-based admin permissions if multiple admins are needed.
- Avoid default `ADMIN1 / ADMIN1` after first production login.

## 20. Production Readiness Report

Current production readiness: partially ready.

Ready foundations:

- Next.js project structure exists.
- PostgreSQL schema exists.
- Seed script exists.
- Secure login foundation exists.
- Public site reads from database.
- Booking saves to database.
- Blog routes exist.
- SEO foundation exists.
- Vercel Blob upload backend exists.
- Vercel deployment README exists.

Not fully production-ready yet:

- Admin panel UI is not fully complete for all CRUD operations.
- Dependencies have not been installed in this workspace.
- A full `next build` has not been run yet.
- Database connection has not been tested with real `POSTGRES_URL`.
- Blob upload has not been tested with real `BLOB_READ_WRITE_TOKEN`.
- Some security hardening remains.

Recommended next steps:

1. Run `npm install`.
2. Add `.env.local` with real values.
3. Run `npm run db:seed`.
4. Run `npm run build`.
5. Complete admin CRUD React forms.
6. Add upload controls to admin forms.
7. Add CSRF and rate limiting.
8. Test booking save and WhatsApp flow.
9. Deploy to Vercel.
10. Change default admin password immediately after first login.

Final conclusion:

The project has been upgraded from a single-file localStorage website into a serious full-stack Next.js/PostgreSQL/Vercel foundation. The backend, schema, seed data, public rendering, booking save, blogs, SEO structure, and secure admin login base are present. To call it fully production-ready, the remaining admin UI forms, upload UI, security hardening, and live build/database testing should be completed.

## Cleanup Update

Date: 2026-06-28

### What Issues Were Found

- `npm run lint` was interactive because the project did not have a lint configuration.
- `npm run build` failed when `POSTGRES_URL` was missing because sitemap generation tried to query Vercel Postgres during build.
- Public database-backed pages needed safer fallback behavior when database environment variables are missing.
- Some API routes returned raw server failures instead of user-friendly JSON errors.
- Broken vehicle/logo images could leave poor UI output.
- Booking date calculation could produce unsafe values if dates were missing or invalid.
- Booking form needed clearer submit loading and success/error feedback.
- Empty vehicle, pricing, and blog states needed friendly UI.
- Generated dependency/cache artifacts needed ignore rules.

### What Issues Were Fixed

- Changed `npm run lint` to a non-interactive TypeScript check using `tsc --noEmit`.
- Added database environment guards with `hasDatabaseUrl()`.
- Added fallback public site data in `lib/fallback-data.ts`.
- Updated site data, SEO, sitemap, blogs, and admin pages to avoid crashing when the database is unavailable.
- Added friendly API error helper in `lib/api.ts`.
- Wrapped all API routes with try/catch error handling.
- Added image fallback handling through `SafeImage`.
- Added empty states for vehicles, pricing, and blogs.
- Added safe booking date calculation.
- Added booking submit loading state.
- Added success/error toast messages for booking actions.
- Added `.gitignore` for `node_modules`, `.next`, `.npm-cache`, real env files, and logs.
- Verified that PostgreSQL remains the permanent content store for the production Next.js version.
- Verified that Vercel Blob remains the intended upload storage through `/api/upload`.
- Verified that important production data does not depend on `localStorage` in the Next.js app.

### Files Changed During Cleanup

- `package.json`
- `.gitignore`
- `lib/api.ts`
- `lib/db.ts`
- `lib/fallback-data.ts`
- `lib/site-data.ts`
- `lib/seo.ts`
- `components/PublicSite.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/admin/page.tsx`
- `app/blogs/page.tsx`
- `app/blogs/[slug]/page.tsx`
- `app/sitemap.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/auth/me/route.ts`
- `app/api/site/route.ts`
- `app/api/bookings/route.ts`
- `app/api/bookings/[id]/route.ts`
- `app/api/upload/route.ts`
- `app/api/admin/hero/route.ts`
- `app/api/admin/logo/route.ts`
- `app/api/admin/contact/route.ts`
- `app/api/admin/about/route.ts`
- `app/api/admin/about-cards/route.ts`
- `app/api/admin/about-cards/[id]/route.ts`
- `app/api/admin/blog-categories/route.ts`
- `app/api/admin/blogs/route.ts`
- `app/api/admin/blogs/[id]/route.ts`
- `app/api/admin/vehicles/route.ts`
- `app/api/admin/vehicles/[id]/route.ts`
- `app/api/admin/pricing/route.ts`
- `app/api/admin/pricing/[id]/route.ts`
- `app/api/admin/reviews/route.ts`
- `app/api/admin/reviews/[id]/route.ts`
- `app/api/admin/seo/route.ts`
- `REPORT_OF_THIS_PROJECT.md`

### Final Build Status

Command run:

```bash
npm run lint
```

Result:

```text
Passed
```

Command run:

```bash
npm run build
```

Result:

```text
Passed
```

Build output confirmed:

- Public home route is dynamic.
- Admin route is dynamic.
- API routes compile.
- Blogs routes compile.
- Sitemap and robots compile.
- TypeScript validation passes.

### Final Production Readiness Status

Current status: production-safe foundation with successful local lint/build.

Ready:

- Project builds successfully.
- TypeScript check passes.
- Public site has fallback UI.
- API routes are protected where admin-only.
- API routes return controlled JSON errors.
- Booking form has loading and toast feedback.
- Broken images have fallback UI.
- Missing database environment variables no longer crash build.
- PostgreSQL remains the permanent database layer.
- Vercel Blob remains the upload storage layer.
- `localStorage` is not used for production data in the Next.js app.
- `.gitignore` protects generated files and secrets.

Still recommended before real launch:

- Complete full interactive admin CRUD forms for every admin section.
- Add CSRF protection for state-changing requests.
- Add rate limiting for login and booking APIs.
- Add blog HTML sanitization before rendering.
- Test with real Vercel Postgres and real Vercel Blob credentials.
- Change the default `ADMIN1 / ADMIN1` password immediately after first production login.
- Run a full browser QA pass on desktop, tablet, and mobile with live data.
