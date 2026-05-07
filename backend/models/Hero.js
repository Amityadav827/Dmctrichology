const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
    slides: [
      {
        tag: { type: String, default: "DMC TRICHOLOGY" },
        title: { type: String, required: true },
        description: { type: String },
        backgroundImage: { type: String, required: true },
        primaryBtnText: { type: String, default: "Book Appointment" },
        primaryBtnLink: { type: String, default: "/book-appointment" },
        secondaryBtnText: { type: String },
        secondaryBtnLink: { type: String }
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero", heroSchema);
