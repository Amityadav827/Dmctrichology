const supabase = require("../config/supabase");
const path = require("path");

/**
 * Uploads a file buffer to Supabase Storage and returns the public URL.
 * Detects bucket based on file type (image or video).
 * @param {Object} file - Multer file object
 * @param {string} folder - Folder name within the bucket (default: 'general')
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
const uploadToSupabase = async (file, folder = 'general') => {
  if (!file || !file.buffer) {
    throw new Error("No file buffer provided for upload.");
  }

  // Determine bucket based on mimetype
  const isVideo = file.mimetype.startsWith('video/');
  const bucketName = isVideo ? 'videos' : 'images';
  
  const ext = path.extname(file.originalname);
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = `${folder}/${fileName}`;

  console.log(`[Supabase Upload] Type: ${file.mimetype}, Bucket: ${bucketName}, Path: ${filePath}`);

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) {
    console.error("[Supabase Upload ERROR]:", error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }

  console.log(`[Supabase Upload SUCCESS]:`, data);

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

module.exports = uploadToSupabase;
