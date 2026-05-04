const supabase = require("../config/supabase");

const createVideoCategory = async (req, res, next) => {
  try {
    const { name, description, order, status } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });

    const { data, error } = await supabase
      .from('video_categories')
      .insert([{ name, description: description || "", order: order || 0, status: status || 'active' }])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const getVideoCategories = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('video_categories').select('*').order('order', { ascending: true });
    if (error) return res.status(500).json({ success: false, message: error.message });
    const formattedData = data.map(item => ({ ...item, _id: item.id }));
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const updateVideoCategory = async (req, res, next) => {
  try {
    const { name, description, order, status } = req.body;
    const { data, error } = await supabase.from('video_categories').update({ name, description, order, status }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const deleteVideoCategory = async (req, res, next) => {
  try {
    const { error } = await supabase.from('video_categories').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const toggleVideoCategoryStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('video_categories').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "Category not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data, error } = await supabase.from('video_categories').update({ status: newStatus }).eq('id', req.params.id).select().single();
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const updateVideoCategoryOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const { data, error } = await supabase.from('video_categories').update({ order: Number(order) }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVideoCategory,
  getVideoCategories,
  updateVideoCategory,
  deleteVideoCategory,
  toggleVideoCategoryStatus,
  updateVideoCategoryOrder,
};
