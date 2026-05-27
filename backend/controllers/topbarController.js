const TopBar = require('../models/TopBar');
const { useSupabaseGlobals, getGlobalSetting, updateGlobalSetting } = require('../utils/supabaseGlobalHelper');

const defaultTopBarData = {
  isVisible: true,
  phone1: "+91-8527830194",
  phone2: "+91-9810939319",
  email: "info@dadumedicalcentre.com",
  announcementText: "",
  socialLinks: [
    { name: 'telegram', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/trooomdx4mjupebkzsmy.png' },
    { name: 'instagram', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/pzzrzqodtujxvlktyk2s.png' },
    { name: 'facebook', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/jkidxsr5nbpwq7y7x0x0.png' },
    { name: 'youtube', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/dgkcwru8nqurjw7f1lz6.png' },
    { name: 'linkedin', link: '#', iconUrl: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/lhgvbca5okvyge6atokb.png' }
  ]
};

const seedDefaultTopBar = async () => {
  try {
    const count = await TopBar.countDocuments();
    if (count === 0) {
      await TopBar.create(defaultTopBarData);
      console.log("✅ TopBar default data seeded in MongoDB.");
    }
  } catch (err) {
    console.error("❌ Error seeding top bar settings in MongoDB:", err.message);
  }
};

const getTopBar = async (req, res, next) => {
  try {
    if (useSupabaseGlobals()) {
      const topBar = await getGlobalSetting('topbar', defaultTopBarData);
      return res.status(200).json({ success: true, data: topBar });
    }

    const topBar = await TopBar.findOne();
    res.status(200).json({ success: true, data: topBar });
  } catch (error) {
    next(error);
  }
};

const updateTopBar = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    // Update in MongoDB first (rollback backup)
    let topBarMongo = await TopBar.findOne();
    if (!topBarMongo) {
      topBarMongo = new TopBar();
    }

    if (updates.isVisible !== undefined) topBarMongo.isVisible = updates.isVisible;
    if (updates.phone1 !== undefined) topBarMongo.phone1 = updates.phone1;
    if (updates.phone2 !== undefined) topBarMongo.phone2 = updates.phone2;
    if (updates.email !== undefined) topBarMongo.email = updates.email;
    if (updates.announcementText !== undefined) topBarMongo.announcementText = updates.announcementText;
    
    if (updates.socialLinks) {
      try {
        const parsed = typeof updates.socialLinks === 'string' ? JSON.parse(updates.socialLinks) : updates.socialLinks;
        if (Array.isArray(parsed)) {
          topBarMongo.socialLinks = parsed;
        }
      } catch (e) {
        console.error("Failed to parse social links");
      }
    }

    await topBarMongo.save();

    // If Supabase is active, update Supabase as well
    if (useSupabaseGlobals()) {
      // Parse social links updates if needed
      let cleanUpdates = { ...updates };
      if (cleanUpdates.socialLinks && typeof cleanUpdates.socialLinks === 'string') {
        try {
          cleanUpdates.socialLinks = JSON.parse(cleanUpdates.socialLinks);
        } catch (e) {
          // Keep string if parse fails
        }
      }
      const topBarSupa = await updateGlobalSetting('topbar', defaultTopBarData, cleanUpdates);
      return res.status(200).json({ success: true, data: topBarSupa });
    }

    res.status(200).json({ success: true, data: topBarMongo });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTopBar, updateTopBar, seedDefaultTopBar };
