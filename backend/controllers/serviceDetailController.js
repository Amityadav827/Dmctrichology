/**
 * serviceDetailController.js
 *
 * All service detail CRUD now uses Supabase (PostgreSQL JSONB).
 * The `service_details` table has: id, slug, data (JSONB), created_at, updated_at
 *
 * API response format is identical to the old MongoDB-based controller,
 * so frontend requires ZERO changes.
 */

const supabase = require('../config/supabase');
const { servicesData } = require('../utils/servicesDataFallback');

// ─── Slug alias map ───────────────────────────────────────────────────────────
const slugAliases = {
  'hair-transplant-cost-in-delhi': 'hair-transplant-cost-in-india'
};

const getSlugLookupCandidates = (slug) => {
  const candidates = [slug];
  if (slugAliases[slug]) candidates.push(slugAliases[slug]);
  return [...new Set(candidates.filter(Boolean))];
};

// ─── Helper: migrate legacy intro.videos → intro.introMedia ──────────────────
const migrateIntroVideos = (updateData) => {
  if (updateData.intro) {
    if (updateData.intro.videos && !updateData.intro.introMedia) {
      updateData.intro.introMedia = (updateData.intro.videos || []).map(v => ({
        type: v.videoUrl ? 'video' : 'image',
        url: v.thumbnail || v.image || v.videoUrl || '',
        title: v.title || '',
        alt: v.title || '',
        thumbnail: v.thumbnail || v.image || ''
      }));
    }
    delete updateData.intro.videos;
  }
  return updateData;
};

// ─── GET /api/service-details/:slug ──────────────────────────────────────────
exports.getServiceDetailBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const lookupCandidates = getSlugLookupCandidates(slug);

    // Try each slug candidate in Supabase
    let serviceDetailData = null;
    for (const candidate of lookupCandidates) {
      const { data: rows, error } = await supabase
        .from('service_details')
        .select('slug, data, updated_at')
        .eq('slug', candidate)
        .limit(1);

      if (error) {
        console.error('Supabase fetch error:', error.message);
        continue;
      }

      if (rows && rows.length > 0) {
        serviceDetailData = rows[0];
        break;
      }
    }

    if (!serviceDetailData) {
      // Fallback to static data (same as before)
      const fallbackData = servicesData.find(s =>
        lookupCandidates.some(candidate => s.slug.toLowerCase() === candidate.toLowerCase())
      );
      if (fallbackData) {
        return res.status(200).json({
          success: true,
          data: { ...fallbackData, slug },
          isFallback: true
        });
      }
      return res.status(404).json({ success: false, message: 'Service details not found' });
    }

    // Merge JSONB data with top-level fields and ensure slug is correct
    const responseData = {
      ...serviceDetailData.data,
      slug: serviceDetailData.slug,
      updatedAt: serviceDetailData.updated_at
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error fetching service details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── PUT /api/service-details/:slug ──────────────────────────────────────────
exports.saveServiceDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const lookupCandidates = getSlugLookupCandidates(slug);

    // Check if a record already exists in Supabase (handle slug aliases)
    let existingSlug = slug;
    for (const candidate of lookupCandidates) {
      const { data: rows } = await supabase
        .from('service_details')
        .select('slug')
        .eq('slug', candidate)
        .limit(1);

      if (rows && rows.length > 0) {
        existingSlug = rows[0].slug;
        break;
      }
    }

    // Prepare update data
    let updateData = { ...req.body };
    updateData.slug = slug; // always force slug to match URL param
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.id;

    // Migrate legacy intro.videos → intro.introMedia
    updateData = migrateIntroVideos(updateData);

    // Upsert to Supabase: merge with existing JSONB data so partial saves work
    // First, get existing data so we can deep-merge
    let existingData = {};
    const { data: existingRows } = await supabase
      .from('service_details')
      .select('data')
      .eq('slug', existingSlug)
      .limit(1);

    if (existingRows && existingRows.length > 0) {
      existingData = existingRows[0].data || {};
    }

    // Deep merge: existing data + new data (new data wins on conflict)
    const mergedData = { ...existingData, ...updateData };

    const { data: savedRow, error } = await supabase
      .from('service_details')
      .upsert(
        {
          slug: existingSlug,
          data: mergedData,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'slug',
          ignoreDuplicates: false
        }
      )
      .select('slug, data, updated_at')
      .single();

    if (error) {
      console.error('Supabase upsert error:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to save to Supabase', error: error.message });
    }

    const responseData = {
      ...savedRow.data,
      slug: savedRow.slug,
      updatedAt: savedRow.updated_at
    };

    res.status(200).json({
      success: true,
      data: responseData,
      message: 'Service details saved successfully'
    });
  } catch (error) {
    console.error('Error saving service details:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── GET /api/service-details/ ───────────────────────────────────────────────
exports.getAllServiceDetails = async (req, res) => {
  try {
    const { data: rows, error } = await supabase
      .from('service_details')
      .select('slug, data, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase getAllServiceDetails error:', error.message);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    // Return same shape as old MongoDB response
    const services = (rows || []).map(row => ({
      slug: row.slug,
      title: row.data?.title || row.data?.banner?.title || '',
      category: row.data?.category || '',
      updatedAt: row.updated_at
    }));

    res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching all service details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
