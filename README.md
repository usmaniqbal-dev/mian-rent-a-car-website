# Mian Rent A Car / CarMian Production Website

Production Next.js version of the existing single-file CarMian website.

## Stack

- Next.js App Router
- React + TypeScript
- PostgreSQL / Vercel Postgres
- Vercel Blob for uploads
- HTTP-only cookie admin sessions
- bcrypt password hashing

## Environment Variables

Copy `.env.example` to `.env.local`:

```env
POSTGRES_URL="postgres://USER:PASSWORD@HOST:5432/DATABASE"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="https://www.carmian.com"
```

## Local Setup

```bash
npm install
npm run db:seed
npm run dev
```

Open:

- Public site: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`
- Blogs: `http://localhost:3000/blogs`

Default seeded admin:

- Username: `ADMIN1`
- Password: `ADMIN1`

## Database

Schema is in:

```text
db/schema.sql
```

Seed script is in:

```text
db/seed.ts
```

The seed creates:

- Admin user with bcrypt-hashed password
- Hero content
- Logo
- Contact details
- All 15 vehicles
- Intercity pricing rows
- About content and cards
- Customer reviews
- Blog category
- SEO seed rows

## API Routes

Public:

- `GET /api/site`
- `POST /api/bookings`

Auth:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Admin protected:

- `/api/admin/hero`
- `/api/admin/logo`
- `/api/admin/contact`
- `/api/admin/vehicles`
- `/api/admin/pricing`
- `/api/admin/about`
- `/api/admin/about-cards`
- `/api/admin/reviews`
- `/api/admin/blogs`
- `/api/admin/blog-categories`
- `/api/admin/seo`
- `/api/bookings`
- `/api/upload`

## Vercel Deployment

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add Vercel Postgres.
4. Add Vercel Blob.
5. Set the environment variables listed above.
6. Run `npm run db:seed` once with production env variables.
7. Deploy.

## Notes

The old `index.html` remains in the project as the visual source/reference. The Next.js UI keeps the same black, white, WhatsApp green, and gold design language while replacing `localStorage` content with PostgreSQL-backed APIs.

SEO support includes:

- Dynamic metadata
- Sitemap
- Robots
- Blog metadata
- SEO settings table
- Clean blog URLs
- Local business keyword seed data

SEO tools provide the technical foundation, but search ranking still depends on content quality, indexing, competition, authority, backlinks, and performance.
