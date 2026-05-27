const BlogPage = require("../models/BlogPage");
const { useSupabase, getSingleton, updateSingleton } = require('../utils/supabaseSingletonHelper');

const defaultBlogPageData = {
  hero: {
    title: "Blog",
    breadcrumbText: "Blog",
    bannerImage: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    overlayOpacity: 0.5,
    bannerHeight: "400px"
  },
  listing: {
    sidebarSearchPlaceholder: "Enter Key Word",
    sidebarCategoriesTitle: "Blog Categories",
    sidebarRecentPostsTitle: "Recent Post",
    promoImage: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png",
    promoLink: "",
    promoButtonText: "Special Offer",
    categories: [
      { name: "Hair Transplant Tips", count: 4 },
      { name: "Scalp Care", count: 3 },
      { name: "PRP & Biologicals", count: 2 }
    ],
    recentPosts: []
  }
};

const getBlogPage = async (req, res) => {
  try {
    // Supabase path (USE_SUPABASE_FOR_HOMEPAGE=true)
    if (useSupabase()) {
      const data = await getSingleton('blog_page', defaultBlogPageData);
      return res.status(200).json({ success: true, data });
    }

    // MongoDB fallback path
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
    // Dual-write: MongoDB first (rollback backup)
    const mongoPage = await BlogPage.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    // Supabase path if active
    if (useSupabase()) {
      const supaData = await updateSingleton('blog_page', defaultBlogPageData, req.body);
      return res.status(200).json({ success: true, data: supaData });
    }

    res.status(200).json({ success: true, data: mongoPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBlogPage,
  updateBlogPage,
};
