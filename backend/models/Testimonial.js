const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    showType: {
      type: String,
      enum: ["Inside", "Outside"],
      default: "Inside",
    },
    serviceName: {
      type: String,
      default: "",
      trim: true,
    },
    source: {
      type: String,
      enum: ["google", "manual", "practo"],
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
    shortName: {
      type: String,
      default: "",
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
      default: 5,
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

module.exports = mongoose.model("Testimonial", testimonialSchema);
