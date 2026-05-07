const TopBar = require('../models/TopBar');

const seedDefaultTopBar = async () => {
  try {
    const count = await TopBar.countDocuments();
    if (count === 0) {
      await TopBar.create({
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
      });
      console.log("✅ TopBar default data seeded.");
    }
  } catch (err) {
    console.error("❌ Error seeding top bar settings:", err.message);
  }
};

const getTopBar = async (req, res, next) => {
  try {
    const topBar = await TopBar.findOne();
    res.status(200).json({ success: true, data: topBar });
  } catch (error) {
    next(error);
  }
};

const updateTopBar = async (req, res, next) => {
  try {
    let topBar = await TopBar.findOne();
    if (!topBar) {
      topBar = new TopBar();
    }

    const updates = { ...req.body };

    // Update fields
    if (updates.isVisible !== undefined) topBar.isVisible = updates.isVisible;
    if (updates.phone1 !== undefined) topBar.phone1 = updates.phone1;
    if (updates.phone2 !== undefined) topBar.phone2 = updates.phone2;
    if (updates.email !== undefined) topBar.email = updates.email;
    if (updates.announcementText !== undefined) topBar.announcementText = updates.announcementText;
    
    if (updates.socialLinks) {
        // expect an array of objects
        try {
            const parsed = typeof updates.socialLinks === 'string' ? JSON.parse(updates.socialLinks) : updates.socialLinks;
            if (Array.isArray(parsed)) {
                topBar.socialLinks = parsed;
            }
        } catch(e) {
            console.error("Failed to parse social links");
        }
    }

    await topBar.save();
    res.status(200).json({ success: true, data: topBar });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTopBar, updateTopBar, seedDefaultTopBar };
