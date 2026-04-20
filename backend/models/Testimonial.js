const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["google", "manual", "website"],
      required: [true, "Source is required"],
      default: "manual",
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    designation: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
