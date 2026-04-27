const mongoose = require("mongoose");
const slugify = require("../utils/slugify");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Blog title is required"], trim: true },
    author: { type: String, required: [true, "Admin Name is required"], trim: true },
    showType: { type: String, enum: ["Inside", "Outside"], default: "Inside" },
    layoutType: { type: String, enum: ["Left", "Right"], default: "Left" },
    adminDescription: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    fullDescription: { type: String, required: [true, "Blog full description is required"] },
    blogImage: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    altTag: { type: String, default: "" },
    tags: { type: [String], default: [] },
    slug: { type: String, unique: true },
    metaTitle: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    blogDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Draft", "Published"], default: "Published" }
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title if not provided
blogSchema.pre("save", async function (next) {
  if (!this.slug) {
    let baseSlug = slugify(this.title);
    
    // Ensure uniqueness
    let slug = baseSlug;
    let count = 1;
    let existing = await mongoose.models.Blog.findOne({ slug });
    while (existing && existing._id.toString() !== this._id.toString()) {
      slug = `${baseSlug}-${count}`;
      existing = await mongoose.models.Blog.findOne({ slug });
      count++;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model("Blog", blogSchema);

