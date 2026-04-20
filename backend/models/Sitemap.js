const mongoose = require("mongoose");

const sitemapSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      unique: true,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    priority: {
      type: Number,
      min: [0, "Priority cannot be less than 0"],
      max: [1, "Priority cannot be greater than 1"],
      default: 0.5,
    },
    changeFreq: {
      type: String,
      enum: ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"],
      default: "weekly",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sitemap", sitemapSchema);
