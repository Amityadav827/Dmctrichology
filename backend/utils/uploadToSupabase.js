const supabase = require("../config/supabase");
const path = require("path");

const BUCKET = "images";

/**
 * Uploads a file buffer to Supabase Storage and returns the public URL.
 * @param {Object} file - Multer file object
 * @param {string} folder - Folder name within the 'images' bucket (default: 'general')
 * @returns {Promise<string>} - Public URL of the uploaded image
 */
const uploadToSupabase = async (file, folder = 'general') => {
  if (!file || !file.buffer) {
    throw new Error("No file buffer provided for upload.");
  }

  const ext = path.extname(file.originalname);
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) {
    console.error("Supabase Storage Upload Error:", error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

module.exports = uploadToSupabase;
