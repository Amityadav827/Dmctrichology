const mongoose = require("mongoose");

const robotsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Robots content is required"],
      trim: true,
      default: "User-agent: *\nAllow: /",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Robots", robotsSchema);
