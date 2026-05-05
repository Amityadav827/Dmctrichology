const supabase = require("../config/supabase");
const uploadToSupabase = require("../utils/uploadToSupabase");

const createResultInner = async (req, res, next) => {
  try {
    const body = { ...req.body };

    if (req.file) {
      body.image = await uploadToSupabase(req.file, 'results');
    }

    const { categoryId, title, description, beforeImage, afterImage, image, status, order } = body;

    const { data, error } = await supabase
      .from('result_inner')
      .insert([{
        category_id: categoryId,
        title,
        description,
        before_image: beforeImage || image,
        after_image: afterImage,
        status: status || 'active',
        order: order || 0
      }])
      .select(`*, category:result_categories(name)`)
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ 
      success: true, 
      data: { 
        ...data, 
        _id: data.id,
        categoryId: data.category ? { ...data.category, _id: data.category_id } : data.category_id
      } 
    });
  } catch (error) {
    next(error);
  }
};

const getResultInners = async (req, res, next) => {
  try {
    let query = supabase.from('result_inner').select(`*, category:result_categories(name)`);
    if (req.query.categoryId) query = query.eq('category_id', req.query.categoryId);

    const { data, error } = await query.order('order', { ascending: true });
    if (error) return res.status(500).json({ success: false, message: error.message });

    const formattedData = data.map(item => ({ 
      ...item, 
      _id: item.id,
      categoryId: item.category ? { ...item.category, _id: item.category_id } : item.category_id
    }));
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const updateResultInner = async (req, res, next) => {
  try {
    const body = { ...req.body };

    if (req.file) {
      body.image = await uploadToSupabase(req.file, 'results');
    }

    const { categoryId, title, description, beforeImage, afterImage, image, status, order } = body;
    const updates = {
      category_id: categoryId,
      title,
      description,
      before_image: beforeImage || image,
      after_image: afterImage,
      status,
      order
    };
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { data, error } = await supabase.from('result_inner').update(updates).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Result item not found" });
    
    // Fetch again with category to keep format consistent
    const { data: updated } = await supabase.from('result_inner').select(`*, category:result_categories(name)`).eq('id', data.id).single();

    return res.status(200).json({ 
      success: true, 
      data: { 
        ...updated, 
        _id: updated.id,
        categoryId: updated.category ? { ...updated.category, _id: updated.category_id } : updated.category_id
      } 
    });
  } catch (error) {
    next(error);
  }
};

const deleteResultInner = async (req, res, next) => {
  try {
    const { error } = await supabase.from('result_inner').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Result item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const toggleResultInnerStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('result_inner').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "Result item not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data, error } = await supabase.from('result_inner').update({ status: newStatus }).eq('id', req.params.id).select().single();
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const updateResultInnerOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const { data, error } = await supabase.from('result_inner').update({ order: Number(order) }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Result item not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResultInner,
  getResultInners,
  updateResultInner,
  deleteResultInner,
  toggleResultInnerStatus,
  updateResultInnerOrder,
};
