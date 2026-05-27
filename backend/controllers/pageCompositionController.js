const Page = require('../models/Page');
const supabase = require('../config/supabase');

const useSupabase = () => {
  return process.env.USE_SUPABASE_FOR_HOMEPAGE === 'true';
};

const defaultComposition = {
  title: "Home Page",
  slug: "home",
  sections: [
    { sectionId: "topbar", type: "global", order: 0, isActive: true },
    { sectionId: "header", type: "global", order: 1, isActive: true },
    { sectionId: "hero", type: "section", order: 2, isActive: true },
    { sectionId: "about-us", type: "section", order: 3, isActive: true },
    { sectionId: "services", type: "section", order: 4, isActive: true },
    { sectionId: "footer", type: "global", order: 100, isActive: true }
  ],
  metadata: {
    title: "DMC Trichology | Best Hair Transplant Clinic In Delhi",
    description: "Experience The Art Of Natural Hair Restoration at DMC Trichology."
  }
};

const seedHomePage = async () => {
  try {
    const home = await Page.findOne({ slug: 'home' });
    if (!home) {
      await Page.create(defaultComposition);
      console.log("✅ Home Page Composition seeded.");
    }
  } catch (err) {
    console.error("❌ Error seeding page data:", err.message);
  }
};

const getPageBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    if (useSupabase()) {
      console.log(`⚡ [Page Composition API] Fetching slug composition "${slug}" from SUPABASE`);
      const { data: row, error } = await supabase
        .from('page_compositions')
        .select('id, data, created_at, updated_at')
        .eq('id', slug)
        .limit(1)
        .single();

      if (error || !row) {
        console.warn(`⚠️ Slug "${slug}" not found in Supabase, returning default composition.`);
        return res.status(200).json({ success: true, data: defaultComposition, isFallback: true });
      }

      const responseData = {
        ...defaultComposition,
        ...row.data,
        id: row.id,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
      return res.status(200).json({ success: true, data: responseData });
    }

    // --- Legacy MongoDB Code ---
    console.log(`🍃 [Page Composition API] Fetching slug composition "${slug}" from MONGODB`);
    const page = await Page.findOne({ slug });
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

const updatePageComposition = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const updateData = req.body;

    if (useSupabase()) {
      console.log(`⚡ [Page Composition API] Updating slug composition "${slug}" on SUPABASE`);
      
      let existingData = {};
      const { data: existingRows } = await supabase
        .from('page_compositions')
        .select('data')
        .eq('id', slug)
        .limit(1);

      if (existingRows && existingRows.length > 0) {
        existingData = existingRows[0].data || {};
      }

      const mergedData = { ...defaultComposition, ...existingData, ...updateData };
      delete mergedData.id;
      delete mergedData.createdAt;
      delete mergedData.updatedAt;

      const { data: savedRow, error: upsertErr } = await supabase
        .from('page_compositions')
        .upsert(
          {
            id: slug,
            data: mergedData,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'id', ignoreDuplicates: false }
        )
        .select('id, data, updated_at')
        .single();

      if (upsertErr) {
        console.error('Supabase upsert error for Page Composition:', upsertErr.message);
        return res.status(500).json({ success: false, message: 'Failed to save to Supabase', error: upsertErr.message });
      }

      const responseData = {
        ...savedRow.data,
        id: savedRow.id,
        updatedAt: savedRow.updated_at
      };

      return res.status(200).json({ success: true, data: responseData, message: 'Page composition updated on Supabase' });
    }

    // --- Legacy MongoDB Code ---
    console.log(`🍃 [Page Composition API] Updating slug composition "${slug}" on MONGODB`);
    const page = await Page.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPageBySlug, updatePageComposition, seedHomePage };
