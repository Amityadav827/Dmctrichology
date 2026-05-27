-- =========================================================================
-- STEP 8: MEDIA SYSTEM SCHEMA PATCH — Run in Supabase SQL Editor
-- Patches public.testimonials to add missing columns expected by testimonialController.js
-- All ALTER TABLE commands use IF NOT EXISTS — completely safe to re-run.
-- =========================================================================

-- Add missing columns to public.testimonials
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS show_type TEXT DEFAULT 'all';
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS service_name TEXT DEFAULT '';
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS short_name TEXT DEFAULT '';
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website';

-- Confirm RLS is disabled for service layer control
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.result_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.result_inner DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;
