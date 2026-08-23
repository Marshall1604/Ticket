-- =========================================================
-- TICKETSHOW LUXURY TICKETING PLATFORM - SUPABASE SCHEMA
-- (Fixes 42P17 Infinite Recursion & Provides Full CRUD Access)
-- =========================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------
-- 2. USERS & PROFILES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'editor')),
  phone TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  total_orders_count INT DEFAULT 0,
  total_spent NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Drop old recursive policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public select profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow delete profiles" ON public.profiles;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update profiles" ON public.profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete profiles" ON public.profiles FOR DELETE USING (true);

-- ---------------------------------------------------------
-- 3. EDITORIAL ARTICLES TABLE (BÀI VIẾT TẠP CHÍ)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  category TEXT DEFAULT 'Phong cách & Nghệ thuật' NOT NULL,
  author_name TEXT DEFAULT 'Ban Biên Tập TICKETSHOW' NOT NULL,
  author_avatar TEXT,
  is_published BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0,
  reading_time_minutes INT DEFAULT 4,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

DROP POLICY IF EXISTS "Published articles are readable by anyone" ON public.articles;
DROP POLICY IF EXISTS "Admins and Editors have full access to articles" ON public.articles;
DROP POLICY IF EXISTS "Allow select articles" ON public.articles;
DROP POLICY IF EXISTS "Allow insert articles" ON public.articles;
DROP POLICY IF EXISTS "Allow update articles" ON public.articles;
DROP POLICY IF EXISTS "Allow delete articles" ON public.articles;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Allow insert articles" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update articles" ON public.articles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete articles" ON public.articles FOR DELETE USING (true);

-- ---------------------------------------------------------
-- 4. ARTISTS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  genre TEXT NOT NULL,
  image TEXT NOT NULL,
  bio TEXT,
  is_featured BOOLEAN DEFAULT false,
  highlight_track TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP POLICY IF EXISTS "Public read artists" ON public.artists;
DROP POLICY IF EXISTS "Admin manage artists" ON public.artists;
DROP POLICY IF EXISTS "Allow all artists" ON public.artists;

ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all artists" ON public.artists FOR ALL USING (true) WITH CHECK (true);

-- ---------------------------------------------------------
-- 5. VENUES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.venues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  district TEXT,
  city TEXT NOT NULL,
  capacity INT DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP POLICY IF EXISTS "Public read venues" ON public.venues;
DROP POLICY IF EXISTS "Allow all venues" ON public.venues;

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all venues" ON public.venues FOR ALL USING (true) WITH CHECK (true);

-- ---------------------------------------------------------
-- 6. EVENTS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  banner_image TEXT NOT NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  date_display TEXT NOT NULL,
  time_display TEXT NOT NULL,
  door_time_display TEXT DEFAULT '18:30',
  starting_price NUMERIC(12, 2) NOT NULL,
  is_hero BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_selling_fast BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'on_sale' CHECK (status IN ('on_sale', 'selling_soon', 'sold_out', 'past')),
  description TEXT[],
  seat_map_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP POLICY IF EXISTS "Public read events" ON public.events;
DROP POLICY IF EXISTS "Allow all events" ON public.events;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all events" ON public.events FOR ALL USING (true) WITH CHECK (true);

-- ---------------------------------------------------------
-- 7. TICKET TYPES / TIERS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ticket_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  description TEXT,
  benefits TEXT[],
  total_quantity INT NOT NULL,
  available_quantity INT NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'selling_fast', 'sold_out'))
);

DROP POLICY IF EXISTS "Public read ticket_types" ON public.ticket_types;
DROP POLICY IF EXISTS "Allow all ticket_types" ON public.ticket_types;

ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all ticket_types" ON public.ticket_types FOR ALL USING (true) WITH CHECK (true);

-- ---------------------------------------------------------
-- 8. ORDERS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID,
  event_id UUID REFERENCES public.events(id),
  ticket_tier_name TEXT NOT NULL,
  quantity INT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  payment_method TEXT DEFAULT 'bank_transfer',
  payment_status TEXT DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'cancelled')),
  qr_code_data TEXT NOT NULL,
  seat_numbers TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow all orders" ON public.orders;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- ---------------------------------------------------------
-- 9. NEWSLETTER SUBSCRIBERS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'homepage',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DROP POLICY IF EXISTS "Allow anonymous newsletter insert" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins view subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow all newsletter" ON public.newsletter_subscribers;

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all newsletter" ON public.newsletter_subscribers FOR ALL USING (true) WITH CHECK (true);
