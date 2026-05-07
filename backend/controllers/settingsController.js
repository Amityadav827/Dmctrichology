const SiteSettings = require('../models/SiteSettings');
const uploadToSupabase = require('../utils/uploadToSupabase');

const seedDefaultSettings = async () => {
  try {
    const count = await SiteSettings.countDocuments();
    if (count === 0) {
      await SiteSettings.create({
        websiteName: "DMC Trichology",
        logo: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/pntwhlftziotd6k0kdkg.png",
        favicon: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lsmvsocjusyrery1hjum.png",
        phone1: "+91-8527830194",
        phone2: "+91-9810939319",
        email: "info@dadumedicalcentre.com",
        address: "",
        primaryColor: "#C19A5B",
        secondaryColor: "#000000",
        appointmentButtonText: "Book Appointment",
        socialLinks: {
          facebook: "",
          instagram: "",
          youtube: "",
          linkedin: ""
        },
        footerCopyright: ""
      });
      console.log("✅ Site settings default data seeded.");
    }
  } catch (err) {
    console.error("❌ Error seeding site settings:", err.message);
  }
};

const getSettings = async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOne();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
    }

    const updates = { ...req.body };
    
    if (updates.socialLinks && typeof updates.socialLinks === 'string') {
        try {
            updates.socialLinks = JSON.parse(updates.socialLinks);
        } catch(e) {
            console.error("Failed to parse social links");
        }
    }

    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        updates.logo = await uploadToSupabase(req.files.logo[0], 'settings');
      }
      if (req.files.favicon && req.files.favicon[0]) {
        updates.favicon = await uploadToSupabase(req.files.favicon[0], 'settings');
      }
    }

    Object.assign(settings, updates);
    await settings.save();

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings, seedDefaultSettings };
