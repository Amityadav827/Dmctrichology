const SiteSettings = require('../models/SiteSettings');
const uploadToSupabase = require('../utils/uploadToSupabase');
const { useSupabaseGlobals, getGlobalSetting, updateGlobalSetting } = require('../utils/supabaseGlobalHelper');

const defaultSettingsData = {
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
  footerCopyright: "",
  patientCount: "225+ Patients",
  ratingStars: 5,
  ratingText: "★★★★★"
};

const seedDefaultSettings = async () => {
  try {
    const count = await SiteSettings.countDocuments();
    if (count === 0) {
      await SiteSettings.create(defaultSettingsData);
      console.log("✅ Site settings default data seeded in MongoDB.");
    }
  } catch (err) {
    console.error("❌ Error seeding site settings in MongoDB:", err.message);
  }
};

const getSettings = async (req, res, next) => {
  try {
    if (useSupabaseGlobals()) {
      const settings = await getGlobalSetting('settings', defaultSettingsData);
      return res.status(200).json({ success: true, data: settings });
    }

    const settings = await SiteSettings.findOne();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    let settingsMongo = await SiteSettings.findOne();
    if (!settingsMongo) {
      settingsMongo = new SiteSettings();
    }

    const updates = { ...req.body };
    
    if (updates.socialLinks && typeof updates.socialLinks === 'string') {
      try {
        updates.socialLinks = JSON.parse(updates.socialLinks);
      } catch (e) {
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

    // Save to MongoDB first
    Object.assign(settingsMongo, updates);
    await settingsMongo.save();

    // Save to Supabase if active
    if (useSupabaseGlobals()) {
      const settingsSupa = await updateGlobalSetting('settings', defaultSettingsData, updates);
      return res.status(200).json({ success: true, data: settingsSupa });
    }

    res.status(200).json({ success: true, data: settingsMongo });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings, seedDefaultSettings };
