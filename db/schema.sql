create extension if not exists pgcrypto;

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists hero_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  background_image_url text,
  button_text text not null default 'Book Now',
  button_link text not null default '#vehicles',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists logos (
  id uuid primary key default gen_random_uuid(),
  image_url text,
  logo_text text not null,
  brand_name text not null,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists contact_info (
  id uuid primary key default gen_random_uuid(),
  phone1 text not null,
  phone2 text not null,
  phone3 text not null,
  whatsapp text not null,
  email text not null,
  address text not null,
  website_url text not null,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  google_maps_embed_url text,
  updated_at timestamptz not null default now()
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text not null,
  image_url text,
  price_lahore text not null,
  price_outside text not null,
  weekly_price text not null,
  monthly_price text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  description text,
  features text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists pricing_rates (
  id uuid primary key default gen_random_uuid(),
  car_type text not null,
  destination_city text not null,
  one_way_price text not null,
  timing_note text not null default '24 hours, within the same date',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists about_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  mission_statement text,
  vision_statement text,
  happy_customers_count integer not null default 500,
  available_vehicles_count integer not null default 15,
  years_experience integer not null default 5,
  support_text text not null default '24/7 Support',
  updated_at timestamptz not null default now()
);

create table if not exists about_cards (
  id uuid primary key default gen_random_uuid(),
  icon text,
  title text not null,
  description text not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists customer_reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_city text not null,
  review_text text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  avatar_initials text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete set null,
  vehicle_name text not null,
  full_name text not null,
  phone text not null,
  pickup_date date not null,
  return_date date not null,
  pickup_location text not null,
  message text,
  total_estimate integer not null default 0,
  status text not null default 'New' check (status in ('New','Contacted','Confirmed','Cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  meta_title text,
  meta_description text,
  focus_keywords text,
  featured_image_url text,
  category_id uuid references blog_categories(id) on delete set null,
  short_excerpt text,
  full_content text not null,
  author text not null default 'Mian Rent A Car',
  status text not null default 'draft' check (status in ('draft','published','scheduled')),
  published_date timestamptz,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_url text,
  schema_type text not null default 'Article',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists seo_settings (
  id uuid primary key default gen_random_uuid(),
  page_name text not null,
  page_path text unique not null,
  meta_title text,
  meta_description text,
  meta_keywords text,
  focus_keywords text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_url text,
  twitter_title text,
  twitter_description text,
  twitter_image_url text,
  robots_index boolean not null default true,
  robots_follow boolean not null default true,
  schema_json_ld jsonb,
  extra_head_scripts text,
  updated_at timestamptz not null default now()
);

create table if not exists uploaded_files (
  id uuid primary key default gen_random_uuid(),
  file_url text not null,
  file_name text not null,
  file_type text not null,
  file_size integer not null,
  uploaded_by uuid references admins(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_vehicles_active_sort on vehicles(active, sort_order);
create index if not exists idx_pricing_active_sort on pricing_rates(active, sort_order);
create index if not exists idx_reviews_active_sort on customer_reviews(active, sort_order);
create index if not exists idx_blogs_status_published on blogs(status, published_date);
create index if not exists idx_bookings_created_at on bookings(created_at desc);
