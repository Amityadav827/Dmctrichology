const supabase = require("../config/supabase");

/**
 * Production-ready Result Category Controller
 */

const createResultCategory = async (req, res, next) => {
  try {
    const { name, description, order, status } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });

    // Duplicate Check
    const { data: existing } = await supabase
      .from('result_categories')
      .select('id')
      .ilike('name', name.trim())
      .single();

    if (existing) {
      return res.status(400).json({ success: false, message: `Category with name "${name}" already exists.` });
    }

    const { data, error } = await supabase
      .from('result_categories')
      .insert([{
        name: name.trim(),
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
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const getResultCategoryById = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('result_categories').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: "Result category not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const updateResultCategory = async (req, res, next) => {
  try {
    const { name, description, order, status } = req.body;
    
    // Duplicate check
    if (name) {
      const { data: existing } = await supabase
        .from('result_categories')
        .select('id')
        .ilike('name', name.trim())
        .neq('id', req.params.id)
        .single();
      
      if (existing) return res.status(400).json({ success: false, message: `Another category with name "${name}" already exists.` });
    }

    const { data, error } = await supabase
      .from('result_categories')
      .update({
        name: name?.trim(),
        description,
        order: order !== undefined ? Number(order) : undefined,
        status,
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: "Result category not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const deleteResultCategory = async (req, res, next) => {
  try {
    // Safety check - Check for linked results
    const { count, error: countError } = await supabase
      .from('result_inner')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', req.params.id);

    if (countError) return res.status(500).json({ success: false, message: countError.message });
    if (count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete. This category has ${count} result item(s) linked to it.` 
      });
    }

    const { error } = await supabase.from('result_categories').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Result category deleted successfully" });
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
