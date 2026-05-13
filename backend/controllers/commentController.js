const supabase = require("../config/supabase");

const createComment = async (req, res, next) => {
  try {
    const { blogSlug, name, email, content } = req.body;

    if (!blogSlug || !name || !email || !content) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const { data, error } = await supabase
      .from('blog_comments')
      .insert([{
        blog_slug: blogSlug,
        name,
        email,
        content,
        status: 'approved' // Auto-approve for now as per user preference for "instantly visible"
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });

    return res.status(201).json({ success: true, data });
  } catch (error) {
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

module.exports = {
  createComment,
  getCommentsBySlug
};
