const supabase = require("../config/supabase");
const uploadToSupabase = require("../utils/uploadToSupabase");

const mapToSupabase = (data) => {
  return {
    title: data.title,
    author: data.author,
    show_type: data.showType,
    layout_type: data.layoutType,
    admin_description: data.adminDescription,
    short_description: data.shortDescription,
    full_description: data.fullDescription,
    blog_image: data.blogImage,
    banner_image: data.bannerImage,
    alt_tag: data.altTag,
    tags: data.tags,
    slug: data.slug,
    meta_title: data.metaTitle,
    meta_keywords: data.metaKeywords,
    meta_description: data.metaDescription,
    canonical_url: data.canonicalUrl,
    blog_date: data.blogDate,
    status: data.status,
  };
};

const mapFromSupabase = (data) => {
  if (!data) return null;
  return {
    _id: data.id,
    id: data.id,
    title: data.title,
    author: data.author,
    showType: data.show_type,
    layoutType: data.layout_type,
    adminDescription: data.admin_description,
    shortDescription: data.short_description,
    fullDescription: data.full_description,
    blogImage: data.blog_image,
    bannerImage: data.banner_image,
    altTag: data.alt_tag,
    tags: data.tags,
    slug: data.slug,
    metaTitle: data.meta_title,
    metaKeywords: data.meta_keywords,
    metaDescription: data.meta_description,
    canonicalUrl: data.canonical_url,
    blogDate: data.blog_date,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

const createBlog = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Handle Image Uploads to Supabase Storage
    if (req.files) {
      if (req.files.blogImage && req.files.blogImage[0]) {
        body.blogImage = await uploadToSupabase(req.files.blogImage[0], 'blogs');
      }
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        body.bannerImage = await uploadToSupabase(req.files.bannerImage[0], 'blogs');
      }
    }

    const supabaseData = mapToSupabase(body);
    const { data, error } = await supabase
      .from('blogs')
      .insert([supabaseData])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(201).json({ success: true, data: mapFromSupabase(data) });
  } catch (error) {
    next(error);
  }
};

const getBlogs = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();

    let query = supabase.from('blogs').select('*', { count: 'exact' });
    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,short_description.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .order('blog_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) return res.status(500).json({ success: false, message: error.message });

    const formattedBlogs = data.map(blog => mapFromSupabase(blog));
    return res.status(200).json({
      success: true,
      count: formattedBlogs.length,
      data: formattedBlogs,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.max(Math.ceil(count / limit), 1),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('blogs').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ success: false, message: error ? error.message : "Blog not found" });
    return res.status(200).json({ success: true, data: mapFromSupabase(data) });
  } catch (error) {
    next(error);
  }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('blogs').select('*').eq('slug', req.params.slug).single();
    if (error || !data) return res.status(404).json({ success: false, message: error ? error.message : "Blog not found" });
    return res.status(200).json({ success: true, data: mapFromSupabase(data) });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Handle Image Uploads to Supabase Storage
    if (req.files) {
      if (req.files.blogImage && req.files.blogImage[0]) {
        body.blogImage = await uploadToSupabase(req.files.blogImage[0], 'blogs');
      }
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        body.bannerImage = await uploadToSupabase(req.files.bannerImage[0], 'blogs');
      }
    }

    const updates = mapToSupabase(body);
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const { data, error } = await supabase.from('blogs').update(updates).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ success: false, message: error ? error.message : "Blog not found" });
    return res.status(200).json({ success: true, data: mapFromSupabase(data) });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { error } = await supabase.from('blogs').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogBySlug,
};
