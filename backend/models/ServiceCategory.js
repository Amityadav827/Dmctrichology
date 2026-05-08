const mongoose = require("mongoose");

const serviceCategorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);
