const mongoose = require("mongoose");

const secondCategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: [true, "Parent category is required"],
    },
    name: {
      type: String,
      required: [true, "Second category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      lowercase: true,
    },
    order: {
      type: Number,
      default: 0,
      min: [0, "Order cannot be negative"],
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

secondCategorySchema.index({ categoryId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model("SecondCategory", secondCategorySchema);
