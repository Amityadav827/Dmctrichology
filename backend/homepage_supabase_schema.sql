-- =========================================================================
-- STEP 5: HOMEPAGE COMPOSITION & SECTIONS SCHEMAS — Run in Supabase SQL Editor
-- =========================================================================

-- 1. PAGE COMPOSITIONS TABLE (Slug-Based Dynamic Ordering Layouts)
CREATE TABLE IF NOT EXISTS public.page_compositions (
  id TEXT PRIMARY KEY, -- e.g. 'home'
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HOMEPAGE SECTIONS TABLE (Singleton Content Sliders/Blocks)
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id TEXT PRIMARY KEY, -- e.g. 'hero', 'marquee', 'why_choose_us', 'results_slider', 'grade_slider', 'reviews_videos', 'about_us_care', 'treatment_plans', 'home_faqs', 'home_blogs', 'press_medias', 'surgeons', 'consultations'
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TIMESTAMP UPDATE TRIGGERS
CREATE OR REPLACE FUNCTION public.update_homepage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_page_compositions ON public.page_compositions;
CREATE TRIGGER trigger_update_page_compositions
  BEFORE UPDATE ON public.page_compositions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_homepage_updated_at();

DROP TRIGGER IF EXISTS trigger_update_homepage_sections ON public.homepage_sections;
CREATE TRIGGER trigger_update_homepage_sections
  BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_homepage_updated_at();

-- 4. DISABLE ROW LEVEL SECURITY (RLS) FOR SERVICE LAYER CONTROL
ALTER TABLE public.page_compositions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections DISABLE ROW LEVEL SECURITY;
