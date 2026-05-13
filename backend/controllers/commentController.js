const supabase = require("../config/supabase");

const createComment = async (req, res, next) => {
  try {
    const { blog_slug, name, email, message } = req.body;

    console.log("[createComment] Incoming payload:", req.body);

    if (!blog_slug || !name || !email || !message) {
      console.error("[createComment] Validation failed: Missing fields");
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Step 1: Get blog_id from slug if it's missing or if we want to be thorough
    const { data: blogData, error: blogError } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', blog_slug)
      .single();

    if (blogError) {
      console.warn("[createComment] Could not find blog ID for slug:", blog_slug, blogError.message);
    }

    // Step 2: Insert comment
    const { data, error } = await supabase
      .from('blog_comments')
      .insert([{
        blog_slug,
        blog_id: blogData?.id || null, 
        name,
        email,
        message,
        status: 'pending' 
      }])
      .select()
      .single();

    if (error) {
      console.error("[createComment] Supabase insert error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }

    console.log("[createComment] Success:", data);
    return res.status(201).json({ success: true, message: "Comment submitted for review" });
  } catch (error) {
    console.error("[createComment] Catch error:", error);
    next(error);
  }
};

const getCommentsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('blog_slug', slug)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ success: false, message: error.message });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Admin Methods
const getAllCommentsAdmin = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('blog_comments')
      .select(`
        *,
        blogs:blog_slug (title)
      `)
      .order('created_at', { ascending: false });

    console.log("[getAllCommentsAdmin] Fetching all comments from Supabase...");
    if (error) {
      console.error("[getAllCommentsAdmin] Supabase Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }

    console.log("[getAllCommentsAdmin] Found comments:", data.length);
    return res.status(200).json({ 
      success: true, 
      data: data,
      comments: data 
    });
  } catch (error) {
    console.error("[getAllCommentsAdmin] Catch Error:", error);
    next(error);
  }
};

const updateCommentStatusAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const { data, error } = await supabase
      .from('blog_comments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });

    return res.status(200).json({ success: true, message: `Comment ${status} successfully`, data });
  } catch (error) {
    next(error);
  }
};

const deleteCommentAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ success: false, message: error.message });

    return res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getCommentsBySlug,
  getAllCommentsAdmin,
  updateCommentStatusAdmin,
  deleteCommentAdmin
};
