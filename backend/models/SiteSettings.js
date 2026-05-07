const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  websiteName: { type: String, default: "DMC Trichology" },
  logo: { type: String, default: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/pntwhlftziotd6k0kdkg.png" },
  favicon: { type: String, default: "" },
  phone1: { type: String, default: "+91-8527830194" },
  phone2: { type: String, default: "+91-9810939319" },
  email: { type: String, default: "info@dadumedicalcentre.com" },
  address: { type: String, default: "" },
  primaryColor: { type: String, default: "#C19A5B" },
  secondaryColor: { type: String, default: "#000000" },
  appointmentButtonText: { type: String, default: "Book Appointment" },
  socialLinks: {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    linkedin: { type: String, default: "" }
  },
  footerCopyright: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
