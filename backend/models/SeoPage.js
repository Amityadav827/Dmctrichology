const mongoose = require("mongoose");

const seoPageSchema = new mongoose.Schema(
  {
    pageName: {
      type: String,
      required: [true, "Page name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    metaTitle: {
      type: String,
      required: [true, "Meta title is required"],
      trim: true,
      maxlength: [70, "Meta title cannot exceed 70 characters"],
    },
    metaDescription: {
      type: String,
      required: [true, "Meta description is required"],
      trim: true,
      maxlength: [160, "Meta description cannot exceed 160 characters"],
    },
    metaKeywords: {
      type: [String],
      default: [],
      validate: {
        validator: Array.isArray,
        message: "Meta keywords must be an array",
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SeoPage", seoPageSchema);
