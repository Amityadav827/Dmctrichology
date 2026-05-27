-- =========================================================================
-- STEP 6: GLOBAL SETTINGS & HEADER/FOOTER SCHEMAS — Run in Supabase SQL Editor
-- =========================================================================

-- 1. UNIFIED GLOBAL SETTINGS TABLE (Singleton JSONB Model)
CREATE TABLE IF NOT EXISTS public.global_settings (
  id TEXT PRIMARY KEY, -- 'header', 'footer', 'topbar', 'settings', 'menus'
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TIMESTAMP UPDATE TRIGGER
CREATE OR REPLACE FUNCTION public.update_global_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_global_settings ON public.global_settings;
CREATE TRIGGER trigger_update_global_settings
  BEFORE UPDATE ON public.global_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_global_settings_updated_at();

-- 3. DISABLE ROW LEVEL SECURITY (RLS) FOR SERVICE LAYER CONTROL
ALTER TABLE public.global_settings DISABLE ROW LEVEL SECURITY;
