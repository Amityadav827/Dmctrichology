-- =========================================================================
-- STEP 2: DR. NANDANI PAGE & LEADS SCHEMAS — Run in Supabase SQL Editor
-- =========================================================================

-- 1. DR. NANDANI PAGE CONTENT TABLE (Singleton JSONB Model)
CREATE TABLE IF NOT EXISTS public.about_dr_nandani (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure there is only ever a maximum of one row (singleton constraint)
CREATE UNIQUE INDEX IF NOT EXISTS idx_about_dr_nandani_single_row ON public.about_dr_nandani ((true));

-- 2. DR. NANDANI LEADS TABLE (UUID Relational Model)
CREATE TABLE IF NOT EXISTS public.about_dr_nandani_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT DEFAULT 'Clinical Consultation',
  appointment_date TIMESTAMPTZ NOT NULL,
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimized Performance Indexes for Leads Queries
CREATE INDEX IF NOT EXISTS idx_dr_nandani_leads_mobile ON public.about_dr_nandani_leads(mobile);
CREATE INDEX IF NOT EXISTS idx_dr_nandani_leads_created_at ON public.about_dr_nandani_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_dr_nandani_leads_status ON public.about_dr_nandani_leads(status);

-- 3. TIMESTAMP UPDATE TRIGGERS
CREATE OR REPLACE FUNCTION public.update_dr_nandani_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_about_dr_nandani ON public.about_dr_nandani;
CREATE TRIGGER trigger_update_about_dr_nandani
  BEFORE UPDATE ON public.about_dr_nandani
  FOR EACH ROW
  EXECUTE FUNCTION public.update_dr_nandani_updated_at();

DROP TRIGGER IF EXISTS trigger_update_about_dr_nandani_leads ON public.about_dr_nandani_leads;
CREATE TRIGGER trigger_update_about_dr_nandani_leads
  BEFORE UPDATE ON public.about_dr_nandani_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_dr_nandani_updated_at();

-- 4. DISABLE ROW LEVEL SECURITY (RLS)
-- Disables RLS to allow public form inserts and dashboard operations without session conflicts
ALTER TABLE public.about_dr_nandani DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_dr_nandani_leads DISABLE ROW LEVEL SECURITY;
