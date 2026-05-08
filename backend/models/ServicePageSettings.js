const mongoose = require("mongoose");

const servicePageSettingsSchema = new mongoose.Schema(
  {
    hero: {
      bannerImage: { type: String, default: "" },
      pageTitle: { type: String, default: "Our Services" },
      breadcrumbText: { type: String, default: "Home > Services" },
      overlayOpacity: { type: Number, default: 0.5 },
      bannerHeight: { type: String, default: "400px" },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServicePageSettings", servicePageSettingsSchema);
