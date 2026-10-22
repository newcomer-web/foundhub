-- ========================================================
-- FoundHub: Supabase PostgreSQL Schema & Setup Script
-- Paste this script into Supabase SQL Editor and click RUN
-- ========================================================

-- 1. Create items table
CREATE TABLE IF NOT EXISTS public.items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_data JSONB DEFAULT '{}'::jsonb,
    type TEXT NOT NULL CHECK (type IN ('FOUND', 'LOST')),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image_urls TEXT[] DEFAULT '{}',
    event_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    incident_location TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    current_holding_location TEXT NOT NULL,
    finder_contact_preference TEXT,
    secret_verification_question TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CLAIM_PENDING', 'RETURNED_TO_OWNER', 'ARCHIVED')),
    reward_amount NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    user_data JSONB DEFAULT '{}'::jsonb,
    content TEXT NOT NULL,
    comment_type TEXT NOT NULL DEFAULT 'GENERAL' CHECK (comment_type IN ('GENERAL', 'OWNER_LEAD', 'OFFICIAL_UPDATE')),
    tagged_owner_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create claims table
CREATE TABLE IF NOT EXISTS public.claims (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    claimant_id TEXT NOT NULL,
    claimant_data JSONB DEFAULT '{}'::jsonb,
    proof_message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    telegram_username TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Indexes for fast exploration and queries
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_type ON public.items(type);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_comments_item_id ON public.comments(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_item_id ON public.claims(item_id);

-- 6. Enable Row Level Security (RLS) & Public access policies
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active items & comments
CREATE POLICY "Public items access" ON public.items FOR ALL USING (true);
CREATE POLICY "Public comments access" ON public.comments FOR ALL USING (true);
CREATE POLICY "Public claims access" ON public.claims FOR ALL USING (true);
CREATE POLICY "Public profiles access" ON public.profiles FOR ALL USING (true);

-- 7. Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for image uploads
CREATE POLICY "Public Access item images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'item-images');

CREATE POLICY "Public Upload item images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'item-images');
