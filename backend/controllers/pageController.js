const supabase = require("../config/supabase");
const slugify = require("../utils/slugify");

const createPage = async (req, res, next) => {
  try {
    const { title, content, status, metaTitle, metaKeywords, metaDescription, canonicalUrl } = req.body;
    let slug = req.body.slug || slugify(title);

    const { data, error } = await supabase
      .from('pages')
      .insert([{
        title,
        slug,
        content,
        status: status || 'Published',
        meta_title: metaTitle,
        meta_keywords: metaKeywords,
        meta_description: metaDescription,
        canonical_url: canonicalUrl,
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const getPages = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('pages').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    const formattedData = data.map(item => ({ ...item, _id: item.id }));
    return res.status(200).json({ success: true, count: formattedData.length, data: formattedData });
  } catch (error) {
    next(error);
  }
};

const getPageById = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('pages').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: "Page not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const getPageBySlug = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('pages').select('*').eq('slug', req.params.slug).single();
    if (error || !data) return res.status(404).json({ success: false, message: "Page not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const updatePage = async (req, res, next) => {
  try {
    const updates = {
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      status: req.body.status,
      meta_title: req.body.metaTitle,
      meta_keywords: req.body.metaKeywords,
      meta_description: req.body.metaDescription,
      canonical_url: req.body.canonicalUrl,
    };
    // Remove undefined
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { data, error } = await supabase.from('pages').update(updates).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: "Page not found" });
    return res.status(200).json({ success: true, data: { ...data, _id: data.id } });
  } catch (error) {
    next(error);
  }
};

const deletePage = async (req, res, next) => {
  try {
    const { error } = await supabase.from('pages').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPage,
  getPages,
  getPageById,
  getPageBySlug,
  updatePage,
  deletePage,
};
