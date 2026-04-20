const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VideoCategory",
      required: [true, "Video category is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
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

module.exports = mongoose.model("Video", videoSchema);
