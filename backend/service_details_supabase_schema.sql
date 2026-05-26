-- =============================================
-- SERVICE DETAILS TABLE — Run in Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS service_details (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on every UPDATE
CREATE OR REPLACE FUNCTION update_service_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_service_details_updated_at ON service_details;

CREATE TRIGGER trigger_update_service_details_updated_at
  BEFORE UPDATE ON service_details
  FOR EACH ROW
  EXECUTE FUNCTION update_service_details_updated_at();

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_service_details_slug ON service_details(slug);

-- Index for fast JSONB queries on title and category
CREATE INDEX IF NOT EXISTS idx_service_details_title ON service_details((data->>'title'));
CREATE INDEX IF NOT EXISTS idx_service_details_category ON service_details((data->>'category'));
