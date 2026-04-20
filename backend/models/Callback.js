const mongoose = require("mongoose");

const callbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Callback", callbackSchema);
