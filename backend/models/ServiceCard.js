const mongoose = require("mongoose");

const serviceCardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    rating: { type: Number, default: 5 },
    duration: { type: String, default: "45-60 mins" },
    shortDescription: { type: String, default: "" },
    category: { type: String, default: "Full Body" }, // Slug of ServiceCategory
    buttonText: { type: String, default: "Book Now" },
    buttonLink: { type: String, default: "/book-appointment" },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["Draft", "Published"], default: "Published" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceCard", serviceCardSchema);
