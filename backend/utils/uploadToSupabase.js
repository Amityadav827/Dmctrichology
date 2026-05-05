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

  try {
    // Determine bucket based on mimetype
    const isVideo = file.mimetype.startsWith('video/');
    const bucketName = isVideo ? 'videos' : 'images';
    
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = `${folder}/${fileName}`;

    console.log(`[Supabase Upload START] File: ${file.originalname}, Size: ${(file.buffer.length / (1024 * 1024)).toFixed(2)} MB, Bucket: ${bucketName}, Path: ${filePath}`);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
        duplex: 'half' // Recommended for large files
      });

    if (error) {
      console.error("[Supabase Upload FAILURE]:", error.message);
      throw new Error(`Supabase storage error: ${error.message}`);
    }

    console.log(`[Supabase Upload SUCCESS] Path: ${data.path}`);

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error("[Supabase Public URL ERROR]: Could not generate public URL");
      throw new Error("Failed to generate public URL for uploaded file.");
    }

    console.log(`[Supabase Public URL]: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("[Supabase Upload CRITICAL ERROR]:", err.message);
    throw err;
  }
};

module.exports = uploadToSupabase;
