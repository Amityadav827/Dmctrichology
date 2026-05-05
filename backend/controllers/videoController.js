const supabase = require("../config/supabase");
const uploadToSupabase = require("../utils/uploadToSupabase");

/**
 * Sync Video Controller with Schema and Support Local File Uploads
 */

const createVideo = async (req, res, next) => {
  try {
    console.log("[Video System] --- UPLOAD ATTEMPT START ---");
    console.log("[Video System] FILES:", req.files);
    console.log("[Video System] BODY:", req.body);

    const body = { ...req.body };
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    // Helper for timeout
    const uploadWithTimeout = async (file, folder) => {
      return Promise.race([
        uploadToSupabase(file, folder),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Upload timed out after 2 minutes")), 120000)
        )
      ]);
    };

    // 1. Handle Video File Upload
    if (videoFile) {
      console.log("[Video System] Processing video file upload...");
      try {
        body.video_url = await uploadWithTimeout(videoFile, 'videos/files');
      } catch (uploadErr) {
        console.error("[Video System] Video upload failed/timed out:", uploadErr.message);
        return res.status(500).json({ 
          success: false, 
          message: `Video upload failed: ${uploadErr.message}` 
        });
      }
    } else if (body.videoUrl || body.video_url) {
      body.video_url = body.videoUrl || body.video_url;
      console.log("[Video System] Using manual video URL:", body.video_url);
    }

    // 2. Handle Thumbnail Upload
    if (thumbnailFile) {
      console.log("[Video System] Processing thumbnail upload...");
      try {
        body.thumbnail = await uploadWithTimeout(thumbnailFile, 'videos/thumbnails');
      } catch (uploadErr) {
        console.error("[Video System] Thumbnail upload failed/timed out:", uploadErr.message);
        return res.status(500).json({ 
          success: false, 
          message: `Thumbnail upload failed: ${uploadErr.message}` 
        });
      }
    } else if (body.thumbnailUrl || body.thumbnail) {
      body.thumbnail = body.thumbnailUrl || body.thumbnail;
    }

    const { categoryId, title, order, status } = body;
    
    // Validation
    if (!categoryId || !title || !body.video_url) {
      console.warn("[Video System] Validation failed: Missing required fields");
      return res.status(400).json({ 
        success: false, 
        message: "Required fields missing: Category, Title, and either a Video File or a Video URL are required." 
      });
    }

    console.log("[Video System] Saving to Database...");
    const { data, error } = await supabase
      .from('videos')
      .insert([{
        category_id: categoryId,
        title,
        video_url: body.video_url,
        thumbnail: body.thumbnail || '',
        order: Number(order) || 0,
        status: status || 'active'
      }])
      .select(`*, category:video_categories(name)`)
      .single();

    if (error) {
      console.error("[Video System] DB INSERT ERROR:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }

    console.log("[Video System] SUCCESS: Video entry created.");
    return res.status(201).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        categoryId: data.category ? { ...data.category, _id: data.category_id } : data.category_id,
        video_url: data.video_url,
        thumbnail: data.thumbnail
      }
    });
  } catch (error) {
    console.error("[Video System] CRITICAL CONTROLLER ERROR:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

const getVideos = async (req, res, next) => {
  try {
    let query = supabase.from('videos').select(`*, category:video_categories(name)`);
    if (req.query.categoryId) query = query.eq('category_id', req.query.categoryId);

    const { data, error } = await query.order('order', { ascending: true });
    if (error) return res.status(500).json({ success: false, message: error.message });

    const formattedData = data.map(item => ({
      ...item,
      _id: item.id,
      categoryId: item.category ? { ...item.category, _id: item.category_id } : item.category_id,
      videoUrl: item.video_url // Keep both for frontend compatibility
    }));
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const updateVideo = async (req, res, next) => {
  try {
    console.log("[Video System] --- UPDATE ATTEMPT START ---");
    console.log("[Video System] FILES:", req.files);
    console.log("[Video System] BODY:", req.body);

    const body = { ...req.body };
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    // Helper for timeout
    const uploadWithTimeout = async (file, folder) => {
      return Promise.race([
        uploadToSupabase(file, folder),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Upload timed out after 2 minutes")), 120000)
        )
      ]);
    };

    // 1. Handle Video File Upload
    if (videoFile) {
      console.log("[Video System] Processing new video file upload...");
      try {
        body.video_url = await uploadWithTimeout(videoFile, 'videos/files');
      } catch (uploadErr) {
        console.error("[Video System] Video upload failed/timed out:", uploadErr.message);
        return res.status(500).json({ 
          success: false, 
          message: `Video upload failed: ${uploadErr.message}` 
        });
      }
    } else if (body.videoUrl || body.video_url) {
      body.video_url = body.videoUrl || body.video_url;
    }

    // 2. Handle Thumbnail Upload
    if (thumbnailFile) {
      console.log("[Video System] Processing new thumbnail upload...");
      try {
        body.thumbnail = await uploadWithTimeout(thumbnailFile, 'videos/thumbnails');
      } catch (uploadErr) {
        console.error("[Video System] Thumbnail upload failed/timed out:", uploadErr.message);
        return res.status(500).json({ 
          success: false, 
          message: `Thumbnail upload failed: ${uploadErr.message}` 
        });
      }
    } else if (body.thumbnailUrl || body.thumbnail) {
      body.thumbnail = body.thumbnailUrl || body.thumbnail;
    }

    const { categoryId, title, order, status } = body;
    const updates = {
      category_id: categoryId,
      title,
      video_url: body.video_url,
      thumbnail: body.thumbnail,
      order: order !== undefined ? Number(order) : undefined,
      status
    };
    
    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    console.log("[Video System] Updating Database for ID:", req.params.id);
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', req.params.id)
      .select(`*, category:video_categories(name)`)
      .single();

    if (error || !data) {
      console.error("[Video System] UPDATE ERROR:", error ? error.message : "Not found");
      return res.status(404).json({ success: false, message: error ? error.message : "Video not found" });
    }

    console.log("[Video System] SUCCESS: Video updated.");
    return res.status(200).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        categoryId: data.category ? { ...data.category, _id: data.category_id } : data.category_id,
        video_url: data.video_url,
        thumbnail: data.thumbnail
      }
    });
  } catch (error) {
    console.error("[Video System] CRITICAL UPDATE ERROR:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    const { error } = await supabase.from('videos').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const toggleVideoStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('videos').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "Video not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data, error } = await supabase.from('videos').update({ status: newStatus }).eq('id', req.params.id).select(`*, category:video_categories(name)`).single();
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        video_url: data.video_url,
        thumbnail: data.thumbnail
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateVideoOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const { data, error } = await supabase.from('videos').update({ order: Number(order) }).eq('id', req.params.id).select(`*, category:video_categories(name)`).single();
    if (error || !data) return res.status(404).json({ success: false, message: "Video not found" });
    return res.status(200).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        video_url: data.video_url,
        thumbnail: data.thumbnail
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVideo,
  getVideos,
  updateVideo,
  deleteVideo,
  toggleVideoStatus,
  updateVideoOrder,
};
