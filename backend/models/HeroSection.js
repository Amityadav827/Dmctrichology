const mongoose = require("mongoose");

const heroSectionSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    subheading: { type: String, required: true },
    buttonText: { type: String, required: true },
    buttonLink: { type: String, required: true },
    backgroundImage: { type: String, required: true },
    trustedText: { type: String, required: true },
    formTitle: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const HeroSection = mongoose.model("HeroSection", heroSectionSchema);

module.exports = HeroSection;
