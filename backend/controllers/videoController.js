const supabase = require("../config/supabase");

const createVideo = async (req, res, next) => {
  try {
    const { categoryId, title, videoUrl, thumbnail, order, status } = req.body;
    if (!categoryId || !title || !videoUrl || !thumbnail) return res.status(400).json({ success: false, message: "Required fields missing" });

    const { data, error } = await supabase
      .from('videos')
      .insert([{
        category_id: categoryId,
        title,
        video_url: videoUrl,
        thumbnail,
        order: order || 0,
        status: status || 'active'
      }])
      .select(`*, category:video_categories(name)`)
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
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
    const { categoryId, title, videoUrl, thumbnail, order, status } = req.body;
    const updates = {
      category_id: categoryId,
      title,
      video_url: videoUrl,
      thumbnail,
      order,
      status
    };
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { data, error } = await supabase.from('videos').update(updates).eq('id', req.params.id).select(`*, category:video_categories(name)`).single();
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
