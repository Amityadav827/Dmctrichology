const BlogPage = require("../models/BlogPage");

const getBlogPage = async (req, res) => {
  try {
    let page = await BlogPage.findOne();
    if (!page) {
      page = await BlogPage.create({});
    }
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBlogPage = async (req, res) => {
  try {
    const page = await BlogPage.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBlogPage,
  updateBlogPage,
};
