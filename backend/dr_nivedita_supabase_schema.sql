-- =========================================================================
-- STEP 3: DR. NIVEDITA PAGE & LEADS SCHEMAS — Run in Supabase SQL Editor
-- =========================================================================

-- 1. DR. NIVEDITA PAGE CONTENT TABLE (Singleton JSONB Model)
CREATE TABLE IF NOT EXISTS public.about_dr_nivedita (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure there is only ever a maximum of one row (singleton constraint)
CREATE UNIQUE INDEX IF NOT EXISTS idx_about_dr_nivedita_single_row ON public.about_dr_nivedita ((true));

-- 2. DR. NIVEDITA LEADS TABLE (UUID Relational Model)
CREATE TABLE IF NOT EXISTS public.about_dr_nivedita_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT DEFAULT 'Dr. Nivedita Consultation',
  appointment_date TIMESTAMPTZ NOT NULL,
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimized Performance Indexes for Leads Queries
CREATE INDEX IF NOT EXISTS idx_dr_nivedita_leads_mobile ON public.about_dr_nivedita_leads(mobile);
CREATE INDEX IF NOT EXISTS idx_dr_nivedita_leads_created_at ON public.about_dr_nivedita_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_dr_nivedita_leads_status ON public.about_dr_nivedita_leads(status);

-- 3. TIMESTAMP UPDATE TRIGGERS
CREATE OR REPLACE FUNCTION public.update_dr_nivedita_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_about_dr_nivedita ON public.about_dr_nivedita;
CREATE TRIGGER trigger_update_about_dr_nivedita
  BEFORE UPDATE ON public.about_dr_nivedita
  FOR EACH ROW
  EXECUTE FUNCTION public.update_dr_nivedita_updated_at();

DROP TRIGGER IF EXISTS trigger_update_about_dr_nivedita_leads ON public.about_dr_nivedita_leads;
CREATE TRIGGER trigger_update_about_dr_nivedita_leads
  BEFORE UPDATE ON public.about_dr_nivedita_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_dr_nivedita_updated_at();

-- 4. DISABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.about_dr_nivedita DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_dr_nivedita_leads DISABLE ROW LEVEL SECURITY;
