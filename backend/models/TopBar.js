const mongoose = require("mongoose");

const topBarSchema = new mongoose.Schema(
  {
    isVisible: { type: Boolean, default: true },
    phone1: { type: String, default: "+91-8527830194" },
    phone2: { type: String, default: "+91-9810939319" },
    email: { type: String, default: "info@dadumedicalcentre.com" },
    announcementText: { type: String, default: "" },
    socialLinks: [
      {
        name: { type: String, required: true },
        link: { type: String, required: true },
        iconUrl: { type: String, required: true },
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("TopBar", topBarSchema);
