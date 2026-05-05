const supabase = require("../config/supabase");

/**
 * Blog Category Controller
 */

const createBlogCategory = async (req, res, next) => {
  try {
    const { name, slug, description, order, status } = req.body;
    if (!name || !slug) return res.status(400).json({ success: false, message: "Name and slug are required" });

    // Duplicate Check
    const { data: existing } = await supabase
      .from('blog_categories')
      .select('id')
      .or(`name.ilike."${name.trim()}",slug.eq."${slug.trim().toLowerCase()}"`)
      .single();

    if (existing) {
      return res.status(400).json({ success: false, message: "Category name or slug already exists" });
    }

    const { data, error } = await supabase
      .from('blog_categories')
      .insert([{ 
        name: name.trim(), 
        slug: slug.trim().toLowerCase(), 
        description: description || "",
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

const getBlogCategories = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
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

const getBlogCategoryById = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('blog_categories').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: "Category not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const updateBlogCategory = async (req, res, next) => {
  try {
    const { name, slug, description, order, status } = req.body;
    
    // Duplicate check
    if (name || slug) {
      const orConditions = [];
      if (name) orConditions.push(`name.ilike."${name.trim()}"`);
      if (slug) orConditions.push(`slug.eq."${slug.trim().toLowerCase()}"`);
      
      const { data: existing } = await supabase
        .from('blog_categories')
        .select('id')
        .or(orConditions.join(','))
        .neq('id', req.params.id)
        .single();
        
      if (existing) return res.status(400).json({ success: false, message: "Category name or slug already exists" });
    }

    const { data, error } = await supabase
      .from('blog_categories')
      .update({ 
        name: name?.trim(), 
        slug: slug?.trim().toLowerCase(), 
        description,
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

const deleteBlogCategory = async (req, res, next) => {
  try {
    // Safety check - Check for linked blogs
    const { count, error: countError } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', req.params.id);

    if (countError) return res.status(500).json({ success: false, message: countError.message });
    if (count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete. This category has ${count} blog(s) linked to it.` 
      });
    }

    const { error } = await supabase.from('blog_categories').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const toggleBlogCategoryStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('blog_categories').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "Category not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data, error } = await supabase.from('blog_categories').update({ status: newStatus }).eq('id', req.params.id).select().single();
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlogCategory,
  getBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
  toggleBlogCategoryStatus,
};
