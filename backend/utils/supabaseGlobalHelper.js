const supabase = require('../config/supabase');

const useSupabaseGlobals = () => {
  return process.env.USE_SUPABASE_GLOBALS === 'true';
};

/**
 * Fetches global setting data from Supabase.
 * Returns null if Supabase feature flag is disabled.
 */
const getGlobalSetting = async (key, defaultData) => {
  if (useSupabaseGlobals()) {
    console.log(`⚡ [Supabase Global Helper] Fetching global setting "${key}" from SUPABASE`);
    
    const { data: rows, error } = await supabase
      .from('global_settings')
      .select('id, data, created_at, updated_at')
      .eq('id', key)
      .limit(1);

    if (error || !rows || rows.length === 0) {
      console.warn(`⚠️ Global setting "${key}" not found in Supabase. Returning fallback defaults.`);
      return { ...defaultData, isFallback: true };
    }

    const row = rows[0];
    
    // For arrays (like 'menus'), the data is returned as an array directly or inside the wrapper
    if (Array.isArray(row.data)) {
      return row.data;
    }

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
 * Upserts global setting data to Supabase.
 * Returns null if Supabase feature flag is disabled.
 */
const updateGlobalSetting = async (key, defaultData, updates) => {
  if (useSupabaseGlobals()) {
    console.log(`⚡ [Supabase Global Helper] Updating global setting "${key}" on SUPABASE`);

    let existingData = {};
    const { data: existingRows } = await supabase
      .from('global_settings')
      .select('data')
      .eq('id', key)
      .limit(1);

    if (existingRows && existingRows.length > 0) {
      existingData = existingRows[0].data || {};
    }

    // Merge updates over existing data, backed by default fallbacks
    // If it's an array, handle differently (direct replacement or array merge)
    let mergedData;
    if (Array.isArray(updates) || Array.isArray(existingData)) {
      mergedData = updates;
    } else {
      mergedData = { ...defaultData, ...existingData, ...updates };
      // Cleanup system fields
      delete mergedData.id;
      delete mergedData.createdAt;
      delete mergedData.updatedAt;
    }

    const { data: savedRow, error: upsertErr } = await supabase
      .from('global_settings')
      .upsert(
        {
          id: key,
          data: mergedData,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id', ignoreDuplicates: false }
      )
      .select('id, data, updated_at')
      .single();

    if (upsertErr) {
      console.error(`❌ Upserting global setting "${key}" failed:`, upsertErr.message);
      throw new Error(`Failed to save global setting "${key}" to Supabase: ${upsertErr.message}`);
    }

    if (Array.isArray(savedRow.data)) {
      return savedRow.data;
    }

    return {
      ...savedRow.data,
      id: savedRow.id,
      updatedAt: savedRow.updated_at
    };
  }
  return null;
};

module.exports = { useSupabaseGlobals, getGlobalSetting, updateGlobalSetting };
