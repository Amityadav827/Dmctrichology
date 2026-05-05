const supabase = require("../config/supabase");

/**
 * Production-ready Second Category Controller
 */

const createSecondCategory = async (req, res, next) => {
  try {
    const { categoryId, name, slug, order, status } = req.body;
    if (!categoryId || !name || !slug) return res.status(400).json({ success: false, message: "Required fields missing" });

    // Duplicate Check
    const { data: existing } = await supabase
      .from('second_categories')
      .select('id')
      .or(`name.ilike."${name.trim()}",slug.eq."${slug.trim()}"`)
      .eq('category_id', categoryId)
      .single();

    if (existing) {
      return res.status(400).json({ success: false, message: "Sub-category name or slug already exists in this parent category" });
    }

    const { data, error } = await supabase
      .from('second_categories')
      .insert([{ 
        category_id: categoryId, 
        name: name.trim(), 
        slug: slug.trim().toLowerCase(), 
        order: Number(order) || 0, 
        status: status || 'active' 
      }])
      .select(`*, category:service_categories(name)`)
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, data: { ...data, _id: data.id, categoryId: data.category ? { ...data.category, _id: data.category_id } : data.category_id } });
  } catch (error) {
    next(error);
  }
};

const getSecondCategories = async (req, res, next) => {
  try {
    let query = supabase.from('second_categories').select(`*, category:service_categories(name)`);
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

const updateSecondCategory = async (req, res, next) => {
  try {
    const { categoryId, name, slug, order, status } = req.body;

    // Duplicate check
    if (name || slug) {
      const orConditions = [];
      if (name) orConditions.push(`name.ilike."${name.trim()}"`);
      if (slug) orConditions.push(`slug.eq."${slug.trim().toLowerCase()}"`);
      
      const { data: existing } = await supabase
        .from('second_categories')
        .select('id')
        .or(orConditions.join(','))
        .eq('category_id', categoryId)
        .neq('id', req.params.id)
        .single();
        
      if (existing) return res.status(400).json({ success: false, message: "Sub-category name or slug already exists in this parent category" });
    }

    const { data, error } = await supabase
      .from('second_categories')
      .update({ 
        category_id: categoryId, 
        name: name?.trim(), 
        slug: slug?.trim().toLowerCase(), 
        order: order !== undefined ? Number(order) : undefined, 
        status 
      })
      .eq('id', req.params.id)
      .select(`*, category:service_categories(name)`)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id, categoryId: data.category ? { ...data.category, _id: data.category_id } : data.category_id } });
  } catch (error) {
    next(error);
  }
};

const deleteSecondCategory = async (req, res, next) => {
  try {
    // Safety check - Check for linked services
    const { count, error: countError } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', req.params.id);

    if (countError) return res.status(500).json({ success: false, message: countError.message });
    if (count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete. This sub-category has ${count} service(s) linked to it.` 
      });
    }

    const { error } = await supabase.from('second_categories').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const toggleSecondCategoryStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('second_categories').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "Category not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data, error } = await supabase.from('second_categories').update({ status: newStatus }).eq('id', req.params.id).select(`*, category:service_categories(name)`).single();
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id, categoryId: data.category ? { ...data.category, _id: data.category_id } : data.category_id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSecondCategory,
  getSecondCategories,
  updateSecondCategory,
  deleteSecondCategory,
  toggleSecondCategoryStatus,
};
