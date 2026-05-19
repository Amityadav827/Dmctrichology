-- ====================================================================
-- MIGRATE NEWSLETTER SYSTEM FROM MONGO -> SUPABASE SCHEMA DEFINITION
-- Copy and paste this exact SQL code in your Supabase SQL Editor:
-- ====================================================================

-- 1. Create the newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    subscribed_to_updates BOOLEAN DEFAULT FALSE,
    source TEXT DEFAULT 'footer-newsletter',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add highly-optimized indexes for searching and filtering
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email 
ON public.newsletter_subscribers (email);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at 
ON public.newsletter_subscribers (created_at DESC);

-- 3. Disable Row Level Security (RLS) for public inserts and admin actions
ALTER TABLE public.newsletter_subscribers DISABLE ROW LEVEL SECURITY;
