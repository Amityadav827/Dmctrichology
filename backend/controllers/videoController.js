const supabase = require("../config/supabase");
const uploadToSupabase = require("../utils/uploadToSupabase");

/**
 * Sync Video Controller with Schema and Support Local File Uploads
 */

const createVideo = async (req, res, next) => {
  try {
    console.log("[Video System] createVideo - req.files received:", req.files);
    const body = { ...req.body };

    // 1. Handle Video File Upload
    if (req.files && req.files.video && req.files.video[0]) {
      console.log("[Video System] Uploading local video file...");
      body.video_url = await uploadToSupabase(req.files.video[0], 'videos/files');
    } else if (body.videoUrl || body.video_url) {
      // Fallback to manual URL input (YouTube etc)
      body.video_url = body.videoUrl || body.video_url;
      console.log("[Video System] Using manual video URL:", body.video_url);
    }

    // 2. Handle Thumbnail Upload
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      console.log("[Video System] Uploading local thumbnail image...");
      body.thumbnail = await uploadToSupabase(req.files.thumbnail[0], 'videos/thumbnails');
    } else if (body.thumbnailUrl || body.thumbnail) {
      // Fallback to manual URL
      body.thumbnail = body.thumbnailUrl || body.thumbnail;
    }

    const { categoryId, title, order, status } = body;
    
    // Validation
    if (!categoryId || !title || !body.video_url) {
      return res.status(400).json({ 
        success: false, 
        message: "Required fields missing: Category, Title, and either a Video File or a Video URL are required." 
      });
    }

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
      console.error("[Create Video ERROR]:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }

    console.log("[Video System] Video created successfully:", data.video_url);

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
    next(error);
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
    console.log("[Video System] updateVideo - req.files received:", req.files);
    const body = { ...req.body };

    // 1. Handle Video File Upload
    if (req.files && req.files.video && req.files.video[0]) {
      body.video_url = await uploadToSupabase(req.files.video[0], 'videos/files');
    } else if (body.videoUrl || body.video_url) {
      body.video_url = body.videoUrl || body.video_url;
    }

    // 2. Handle Thumbnail Upload
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      body.thumbnail = await uploadToSupabase(req.files.thumbnail[0], 'videos/thumbnails');
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

    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', req.params.id)
      .select(`*, category:video_categories(name)`)
      .single();

    if (error || !data) {
      console.error("[Update Video ERROR]:", error ? error.message : "Not found");
      return res.status(404).json({ success: false, message: error ? error.message : "Video not found" });
    }

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
    next(error);
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
