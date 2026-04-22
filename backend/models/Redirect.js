const mongoose = require("mongoose");

const redirectSchema = new mongoose.Schema(
  {
    sourceUrl: {
      type: String,
      required: [true, "Source URL is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    destinationUrl: {
      type: String,
      required: [true, "Destination URL is required"],
      trim: true,
    },
    type: {
      type: Number,
      enum: [301, 302],
      default: 301,
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

// Index for efficient lookups
redirectSchema.index({ sourceUrl: 1 });

module.exports = mongoose.model("Redirect", redirectSchema);
