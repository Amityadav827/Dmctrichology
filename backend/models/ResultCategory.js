const mongoose = require("mongoose");

const resultCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Result category name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
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

module.exports = mongoose.model("ResultCategory", resultCategorySchema);
