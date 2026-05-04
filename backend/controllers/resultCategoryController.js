const supabase = require("../config/supabase");

const createResultCategory = async (req, res, next) => {
  try {
    const { name, description, order, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const { data, error } = await supabase
      .from('result_categories')
      .insert([{
        name,
        description: description || "",
        order: Number(order) || 0,
        status: status || "active",
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const getResultCategories = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('result_categories')
      .select('*')
      .order('order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ success: false, message: error.message });

    const formattedData = data.map(item => ({ ...item, _id: item.id }));

    return res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

const getResultCategoryById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('result_categories')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: "Result category not found" });

    return res.status(200).json({
      success: true,
      data: { ...data, _id: data.id },
    });
  } catch (error) {
    next(error);
  }
};

const updateResultCategory = async (req, res, next) => {
  try {
    const { name, description, order, status } = req.body;
    
    const { data, error } = await supabase
      .from('result_categories')
      .update({
        name,
        description,
        order: order !== undefined ? Number(order) : undefined,
        status,
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: "Result category not found" });

    return res.status(200).json({
      success: true,
      data: { ...data, _id: data.id },
    });
  } catch (error) {
    next(error);
  }
};

const deleteResultCategory = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('result_categories')
      .delete()
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ success: false, message: error.message });

    return res.status(200).json({
      success: true,
      message: "Result category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleResultCategoryStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('result_categories').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "Result category not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";

    const { data, error } = await supabase.from('result_categories').update({ status: newStatus }).eq('id', req.params.id).select().single();
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const updateResultCategoryOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const { data, error } = await supabase.from('result_categories').update({ order: Number(order) }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Result category not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResultCategory,
  getResultCategories,
  getResultCategoryById,
  updateResultCategory,
  deleteResultCategory,
  toggleResultCategoryStatus,
  updateResultCategoryOrder,
};
