const supabase = require("../config/supabase");
const uploadToSupabase = require("../utils/uploadToSupabase");

const createVideo = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Handle Thumbnail and Video File Uploads to Supabase Storage
    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        body.thumbnail = await uploadToSupabase(req.files.thumbnail[0], 'videos/thumbnails');
      }
      if (req.files.videoFile && req.files.videoFile[0]) {
        body.video_url = await uploadToSupabase(req.files.videoFile[0], 'videos/files');
      }
    }

    // Use videoUrl from body if no file was uploaded (YouTube case)
    if (!body.video_url && body.videoUrl) {
      body.video_url = body.videoUrl;
    }

    const { categoryId, title, order, status } = body;
    
    if (!categoryId || !title || !body.video_url) {
      return res.status(400).json({ success: false, message: "Required fields missing (Category, Title, and Video URL/File)" });
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

    return res.status(201).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        categoryId: data.category ? { ...data.category, _id: data.category_id } : data.category_id,
        videoUrl: data.video_url
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
      videoUrl: item.video_url
    }));
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const updateVideo = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Handle Thumbnail and Video File Uploads to Supabase Storage
    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        body.thumbnail = await uploadToSupabase(req.files.thumbnail[0], 'videos/thumbnails');
      }
      if (req.files.videoFile && req.files.videoFile[0]) {
        body.video_url = await uploadToSupabase(req.files.videoFile[0], 'videos/files');
      }
    }

    // Use videoUrl from body if no file was uploaded
    if (!body.video_url && body.videoUrl) {
      body.video_url = body.videoUrl;
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
        videoUrl: data.video_url
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
        categoryId: data.category ? { ...data.category, _id: data.category_id } : data.category_id,
        videoUrl: data.video_url
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
        categoryId: data.category ? { ...data.category, _id: data.category_id } : data.category_id,
        videoUrl: data.video_url
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
