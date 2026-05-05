const supabase = require("../config/supabase");

/**
 * Production-ready Service Category Controller
 */

const createCategory = async (req, res, next) => {
  try {
    const { name, slug, order, status } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: "Name and slug are required" });
    }

    // Duplicate Check
    const { data: existing } = await supabase
      .from('service_categories')
      .select('id')
      .or(`name.ilike."${name.trim()}",slug.eq."${slug.trim()}"`)
      .single();

    if (existing) {
      return res.status(400).json({ success: false, message: "Category name or slug already exists" });
    }

    const { data, error } = await supabase
      .from('service_categories')
      .insert([{ 
        name: name.trim(), 
        slug: slug.trim().toLowerCase(), 
        order: Number(order) || 0, 
        status: status || 'active' 
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('service_categories')
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

const getCategoryById = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('service_categories').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, slug, order, status } = req.body;
    
    // Duplicate check for rename
    if (name || slug) {
      let query = supabase.from('service_categories').select('id').neq('id', req.params.id);
      const orConditions = [];
      if (name) orConditions.push(`name.ilike."${name.trim()}"`);
      if (slug) orConditions.push(`slug.eq."${slug.trim().toLowerCase()}"`);
      
      const { data: existing } = await query.or(orConditions.join(',')).single();
      if (existing) return res.status(400).json({ success: false, message: "Category name or slug already exists" });
    }

    const { data, error } = await supabase
      .from('service_categories')
      .update({ 
        name: name?.trim(), 
        slug: slug?.trim().toLowerCase(), 
        order: order !== undefined ? Number(order) : undefined, 
        status 
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    // Safety check - Check for linked second categories
    const { count, error: countError } = await supabase
      .from('second_categories')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', req.params.id);

    if (countError) return res.status(500).json({ success: false, message: countError.message });
    if (count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete. This category has ${count} sub-categories linked to it.` 
      });
    }

    const { error } = await supabase.from('service_categories').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const toggleCategoryStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('service_categories').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "Category not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data, error } = await supabase.from('service_categories').update({ status: newStatus }).eq('id', req.params.id).select().single();
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const updateCategoryOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const { data, error } = await supabase.from('service_categories').update({ order: Number(order) }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  updateCategoryOrder,
};
