-- =========================================================================
-- STEP 4: HAIR TRANSPLANT CLINIC PAGE & LEADS SCHEMAS — Run in Supabase SQL Editor
-- =========================================================================

-- 1. HAIR TRANSPLANT CLINIC PAGE CONTENT TABLE (Singleton JSONB Model)
CREATE TABLE IF NOT EXISTS public.hair_transplant_clinic (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure there is only ever a maximum of one row (singleton constraint)
CREATE UNIQUE INDEX IF NOT EXISTS idx_hair_transplant_clinic_single_row ON public.hair_transplant_clinic ((true));

-- 2. HAIR TRANSPLANT CLINIC LEADS TABLE (UUID Relational Model)
CREATE TABLE IF NOT EXISTS public.hair_transplant_clinic_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT DEFAULT 'Hair Transplant Clinic Consultation',
  appointment_date TIMESTAMPTZ NOT NULL,
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimized Performance Indexes for Leads Queries
CREATE INDEX IF NOT EXISTS idx_hair_transplant_clinic_leads_mobile ON public.hair_transplant_clinic_leads(mobile);
CREATE INDEX IF NOT EXISTS idx_hair_transplant_clinic_leads_created_at ON public.hair_transplant_clinic_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_hair_transplant_clinic_leads_status ON public.hair_transplant_clinic_leads(status);

-- 3. TIMESTAMP UPDATE TRIGGERS
CREATE OR REPLACE FUNCTION public.update_hair_transplant_clinic_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_hair_transplant_clinic ON public.hair_transplant_clinic;
CREATE TRIGGER trigger_update_hair_transplant_clinic
  BEFORE UPDATE ON public.hair_transplant_clinic
  FOR EACH ROW
  EXECUTE FUNCTION public.update_hair_transplant_clinic_updated_at();

DROP TRIGGER IF EXISTS trigger_update_hair_transplant_clinic_leads ON public.hair_transplant_clinic_leads;
CREATE TRIGGER trigger_update_hair_transplant_clinic_leads
  BEFORE UPDATE ON public.hair_transplant_clinic_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_hair_transplant_clinic_updated_at();

-- 4. DISABLE ROW LEVEL SECURITY (RLS) FOR SERVICE LAYER CONTROL
ALTER TABLE public.hair_transplant_clinic DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hair_transplant_clinic_leads DISABLE ROW LEVEL SECURITY;
