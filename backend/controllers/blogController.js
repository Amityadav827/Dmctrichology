const Blog = require("../models/Blog");

const createBlog = async (req, res, next) => {
  try {
    const blogData = { ...req.body };

    if (req.files) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      if (req.files.blogImage && req.files.blogImage[0]) {
        blogData.blogImage = `${baseUrl}/uploads/${req.files.blogImage[0].filename}`;
      }
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        blogData.bannerImage = `${baseUrl}/uploads/${req.files.bannerImage[0].filename}`;
      }
    }

    if (blogData.tags && typeof blogData.tags === 'string') {
      blogData.tags = blogData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    const blog = await Blog.create(blogData);

    return res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    if (req.files) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      if (req.files.blogImage && req.files.blogImage[0]) {
        updateData.blogImage = `${baseUrl}/uploads/${req.files.blogImage[0].filename}`;
      }
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        updateData.bannerImage = `${baseUrl}/uploads/${req.files.bannerImage[0].filename}`;
      }
    }

    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }

    await blog.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: "Published" });

    if (!blog) {
      res.status(404);
      throw new Error("Blog not found");
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
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
