-- =========================================================================
-- STEP 1: ABOUT US TABLE — Run in Supabase SQL Editor
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.about_us (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure there is only ever a maximum of one row (singleton constraint)
CREATE UNIQUE INDEX IF NOT EXISTS idx_about_us_single_row ON public.about_us ((true));

-- Trigger function to auto-update updated_at on updates
CREATE OR REPLACE FUNCTION public.update_about_us_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_about_us_updated_at ON public.about_us;

CREATE TRIGGER trigger_update_about_us_updated_at
  BEFORE UPDATE ON public.about_us
  FOR EACH ROW
  EXECUTE FUNCTION public.update_about_us_updated_at();

-- Disable RLS to allow public fetches and CMS dashboard updates
ALTER TABLE public.about_us DISABLE ROW LEVEL SECURITY;
