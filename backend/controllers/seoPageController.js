const supabase = require("../config/supabase");

const createSeoPage = async (req, res, next) => {
  try {
    const { pageName, slug, metaTitle, metaDescription, metaKeywords, status } = req.body;
    if (!pageName || !slug || !metaTitle || !metaDescription) {
      return res.status(400).json({ success: false, message: "Required SEO fields missing" });
    }

    const { data, error } = await supabase
      .from('seo_pages')
      .insert([{
        page_name: pageName,
        slug,
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_keywords: metaKeywords || [],
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

const getSeoPages = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('seo_pages').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    const formattedData = data.map(item => ({
      ...item,
      _id: item.id,
      pageName: item.page_name,
      metaTitle: item.meta_title,
      metaDescription: item.meta_description,
      metaKeywords: item.meta_keywords
    }));
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const getSeoPageById = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('seo_pages').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: "SEO data not found" });
    return res.status(200).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        pageName: data.page_name,
        metaTitle: data.meta_title,
        metaDescription: data.meta_description,
        metaKeywords: data.meta_keywords
      }
    });
  } catch (error) {
    next(error);
  }
};

const getSeoPageBySlug = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('seo_pages').select('*').eq('slug', req.params.slug).single();
    if (error || !data) return res.status(404).json({ success: false, message: "SEO data not found" });
    return res.status(200).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        pageName: data.page_name,
        metaTitle: data.meta_title,
        metaDescription: data.meta_description,
        metaKeywords: data.meta_keywords
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateSeoPage = async (req, res, next) => {
  try {
    const updates = {
      page_name: req.body.pageName,
      slug: req.body.slug,
      meta_title: req.body.metaTitle,
      meta_description: req.body.metaDescription,
      meta_keywords: req.body.metaKeywords,
      status: req.body.status,
    };
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { data, error } = await supabase.from('seo_pages').update(updates).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "SEO data not found" });
    return res.status(200).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        pageName: data.page_name,
        metaTitle: data.meta_title,
        metaDescription: data.meta_description,
        metaKeywords: data.meta_keywords
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteSeoPage = async (req, res, next) => {
  try {
    const { error } = await supabase.from('seo_pages').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "SEO data deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const toggleSeoPageStatus = async (req, res, next) => {
  try {
    const { data: current, error: fetchError } = await supabase.from('seo_pages').select('status').eq('id', req.params.id).single();
    if (fetchError || !current) return res.status(404).json({ success: false, message: "SEO data not found" });

    const newStatus = current.status === "active" ? "inactive" : "active";
    const { data, error } = await supabase.from('seo_pages').update({ status: newStatus }).eq('id', req.params.id).select().single();
    
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({
      success: true,
      data: {
        ...data,
        _id: data.id,
        pageName: data.page_name,
        metaTitle: data.meta_title,
        metaDescription: data.meta_description,
        metaKeywords: data.meta_keywords
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSeoPage,
  getSeoPages,
  getSeoPageById,
  getSeoPageBySlug,
  updateSeoPage,
  deleteSeoPage,
  toggleSeoPageStatus,
};
