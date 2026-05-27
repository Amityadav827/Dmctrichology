const AboutUs = require('../models/AboutUs');
const { aboutUsFallback } = require('../utils/aboutUsFallback');
const supabase = require('../config/supabase');

// Feature Flag: Set to true in .env to route traffic to Supabase
const useSupabase = () => {
  return process.env.USE_SUPABASE_FOR_ABOUT === 'true';
};

// Get About Us data
exports.getAboutUs = async (req, res) => {
  try {
    if (useSupabase()) {
      console.log("⚡ [AboutUs API] Routing GET request to SUPABASE");
      
      const { data: rows, error } = await supabase
        .from('about_us')
        .select('id, data, created_at, updated_at')
        .eq('id', 1)
        .limit(1);

      if (error) {
        console.error('Supabase fetch error for About Us:', error.message);
        // Fall back to static config as safety net
        return res.status(200).json({ success: true, data: aboutUsFallback, isFallback: true });
      }

      if (!rows || rows.length === 0) {
        console.log("⚠️ No About Us document found in Supabase. Returning static fallback data.");
        return res.status(200).json({ success: true, data: aboutUsFallback, isFallback: true });
      }

      const row = rows[0];
      const responseData = {
        ...row.data,
        id: row.id,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };

      return res.status(200).json({ success: true, data: responseData });
    }

    // --- Legacy MongoDB Code ---
    console.log("🍃 [AboutUs API] Routing GET request to MONGODB");
    const aboutData = await AboutUs.findOne();
    if (!aboutData) {
      return res.status(200).json({ success: true, data: aboutUsFallback, isFallback: true });
    }
    res.status(200).json({ success: true, data: aboutData });

  } catch (error) {
    console.error('Error fetching About Us data:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update About Us data
exports.updateAboutUs = async (req, res) => {
  try {
    const updateData = req.body;

    if (useSupabase()) {
      console.log("⚡ [AboutUs API] Routing UPDATE request to SUPABASE");

      // Retrieve existing data to perform deep-merge so partial saves don't erase sections
      let existingData = {};
      const { data: existingRows, error: fetchErr } = await supabase
        .from('about_us')
        .select('data')
        .eq('id', 1)
        .limit(1);

      if (!fetchErr && existingRows && existingRows.length > 0) {
        existingData = existingRows[0].data || {};
      }

      // Merge new data over existing (new wins on conflict)
      const mergedData = { ...existingData, ...updateData };
      delete mergedData.id;
      delete mergedData.createdAt;
      delete mergedData.updatedAt;

      const { data: savedRow, error: upsertErr } = await supabase
        .from('about_us')
        .upsert(
          {
            id: 1,
            data: mergedData,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'id',
            ignoreDuplicates: false
          }
        )
        .select('id, data, updated_at')
        .single();

      if (upsertErr) {
        console.error('Supabase upsert error for About Us:', upsertErr.message);
        return res.status(500).json({ success: false, message: 'Failed to save to Supabase', error: upsertErr.message });
      }

      const responseData = {
        ...savedRow.data,
        id: savedRow.id,
        updatedAt: savedRow.updated_at
      };

      return res.status(200).json({
        success: true,
        data: responseData,
        message: "About Us updated successfully on Supabase"
      });
    }

    // --- Legacy MongoDB Code ---
    console.log("🍃 [AboutUs API] Routing UPDATE request to MONGODB");
    const aboutData = await AboutUs.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ success: true, data: aboutData, message: "About Us updated successfully" });

  } catch (error) {
    console.error('Error updating About Us data:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const uploadToSupabase = require('../utils/uploadToSupabase');

exports.uploadTestimonialImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }
    const publicUrl = await uploadToSupabase(req.file, 'about_us_testimonials');
    res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Testimonial image upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
