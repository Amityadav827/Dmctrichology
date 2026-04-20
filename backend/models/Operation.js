const mongoose = require("mongoose");

const operationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Operation name is required"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Operation URL is required"],
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

module.exports = mongoose.model("Operation", operationSchema);
