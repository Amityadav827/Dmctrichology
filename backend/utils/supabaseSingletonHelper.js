const supabase = require('../config/supabase');

const useSupabase = () => {
  return process.env.USE_SUPABASE_FOR_HOMEPAGE === 'true';
};

/**
 * Fetches singleton section data from Supabase.
 * Returns null if Supabase feature flag is disabled.
 */
const getSingleton = async (sectionKey, defaultData) => {
  if (useSupabase()) {
    console.log(`⚡ [Supabase Helper] Fetching section "${sectionKey}" from SUPABASE`);
    
    const { data: rows, error } = await supabase
      .from('homepage_sections')
      .select('id, data, created_at, updated_at')
      .eq('id', sectionKey)
      .limit(1);

    if (error || !rows || rows.length === 0) {
      console.warn(`⚠️ Section "${sectionKey}" not found in Supabase. Returning fallback defaults.`);
      return { ...defaultData, isFallback: true };
    }

    const row = rows[0];
    return {
      ...defaultData,
      ...row.data,
      id: row.id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
  return null;
};

/**
 * Upserts singleton section data to Supabase.
 * Returns null if Supabase feature flag is disabled.
 */
const updateSingleton = async (sectionKey, defaultData, updates) => {
  if (useSupabase()) {
    console.log(`⚡ [Supabase Helper] Updating section "${sectionKey}" on SUPABASE`);

    let existingData = {};
    const { data: existingRows } = await supabase
      .from('homepage_sections')
      .select('data')
      .eq('id', sectionKey)
      .limit(1);

    if (existingRows && existingRows.length > 0) {
      existingData = existingRows[0].data || {};
    }

    // Merge new updates over existing data, backed by default fallbacks
    const mergedData = { ...defaultData, ...existingData, ...updates };
    
    // Cleanup system fields
    delete mergedData.id;
    delete mergedData.createdAt;
    delete mergedData.updatedAt;

    const { data: savedRow, error: upsertErr } = await supabase
      .from('homepage_sections')
      .upsert(
        {
          id: sectionKey,
          data: mergedData,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id', ignoreDuplicates: false }
      )
      .select('id, data, updated_at')
      .single();

    if (upsertErr) {
      console.error(`❌ Upserting section "${sectionKey}" failed:`, upsertErr.message);
      throw new Error(`Failed to save section "${sectionKey}" to Supabase: ${upsertErr.message}`);
    }

    return {
      ...savedRow.data,
      id: savedRow.id,
      updatedAt: savedRow.updated_at
    };
  }
  return null;
};

module.exports = { useSupabase, getSingleton, updateSingleton };
