const mongoose = require("mongoose");
const slugify = require("../utils/slugify");

const pageSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Page title is required"], 
      trim: true 
    },
    slug: { 
      type: String, 
      unique: true,
      lowercase: true,
      trim: true
    },
    content: { 
      type: String, 
      required: [true, "Page content is required"] 
    },
    status: { 
      type: String, 
      enum: ["Draft", "Published"], 
      default: "Published" 
    },
    metaTitle: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title if not provided
pageSchema.pre("save", async function (next) {
  if (!this.slug) {
    let baseSlug = slugify(this.title);
    
    // Ensure uniqueness
    let slug = baseSlug;
    let count = 1;
    let existing = await mongoose.models.Page.findOne({ slug });
    while (existing && existing._id.toString() !== this._id.toString()) {
      slug = `${baseSlug}-${count}`;
      existing = await mongoose.models.Page.findOne({ slug });
      count++;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model("Page", pageSchema);
