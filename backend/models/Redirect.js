const mongoose = require("mongoose");

const redirectSchema = new mongoose.Schema(
  {
    fromUrl: {
      type: String,
      required: [true, "From URL is required"],
      trim: true,
    },
    toUrl: {
      type: String,
      required: [true, "To URL is required"],
      trim: true,
    },
    type: {
      type: Number,
      enum: [301, 302],
      required: [true, "Redirect type is required"],
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

module.exports = mongoose.model("Redirect", redirectSchema);
