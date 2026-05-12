const mongoose = require("mongoose");

const blogPageSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: "Blog" },
      breadcrumbText: { type: String, default: "Blog" },
      bannerImage: { type: String, default: "https://fxzkbhhinbjbeegkjnae.supabase.co/storage/v1/object/public/images/gallery/1778236591942-282403808.png" },
      overlayOpacity: { type: Number, default: 0.5 },
      bannerHeight: { type: String, default: "400px" },
    },
    listing: {
      sidebarSearchPlaceholder: { type: String, default: "Enter Key Word" },
      sidebarCategoriesTitle: { type: String, default: "Blog Categories" },
      sidebarRecentPostsTitle: { type: String, default: "Recent Post" },
      promoImage: { type: String, default: "" },
      promoLink: { type: String, default: "" },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPage", blogPageSchema);
