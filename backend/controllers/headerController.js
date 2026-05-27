const Header = require('../models/Header');
const { useSupabaseGlobals, getGlobalSetting, updateGlobalSetting } = require('../utils/supabaseGlobalHelper');

const defaultHeaderData = {
  logoUrl: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/pntwhlftziotd6k0kdkg.png",
  isSticky: true,
  appointmentButtonText: "Book Appointment",
  appointmentButtonLink: "/book-appointment",
  menuItems: [
    { label: "Home", link: "/" },
    { label: "About Us", link: "/about-us" },
    { 
      label: "Services", 
      link: "#", 
      hasDropdown: true,
      submenu: [
        { label: "Hair Transplant", link: "/services/hair-transplant" },
        { label: "Hair Treatments", link: "/services/hair-treatments" }
      ]
    },
    { label: "Results", link: "/results" },
    { label: "Testimonials", link: "/testimonials" },
    { label: "Blog", link: "/blog" },
    { label: "Contact Us", link: "/contact" }
  ]
};

const seedDefaultHeader = async () => {
  try {
    const count = await Header.countDocuments();
    if (count === 0) {
      await Header.create(defaultHeaderData);
      console.log("✅ Header default data seeded in MongoDB.");
    }
  } catch (err) {
    console.error("❌ Error seeding header settings in MongoDB:", err.message);
  }
};

const getHeader = async (req, res, next) => {
  try {
    if (useSupabaseGlobals()) {
      const header = await getGlobalSetting('header', defaultHeaderData);
      return res.status(200).json({ success: true, data: header });
    }
    const header = await Header.findOne();
    res.status(200).json({ success: true, data: header });
  } catch (error) {
    next(error);
  }
};

const updateHeader = async (req, res, next) => {
  try {
    const updates = req.body;

    // Update in MongoDB first (rollback backup)
    let headerMongo = await Header.findOne();
    if (!headerMongo) headerMongo = new Header();
    
    if (updates.logoUrl !== undefined) headerMongo.logoUrl = updates.logoUrl;
    if (updates.isSticky !== undefined) headerMongo.isSticky = updates.isSticky;
    if (updates.appointmentButtonText !== undefined) headerMongo.appointmentButtonText = updates.appointmentButtonText;
    if (updates.appointmentButtonLink !== undefined) headerMongo.appointmentButtonLink = updates.appointmentButtonLink;
    if (updates.menuItems !== undefined) headerMongo.menuItems = updates.menuItems;
    await headerMongo.save();

    // If Supabase is active, update Supabase as well
    if (useSupabaseGlobals()) {
      const headerSupa = await updateGlobalSetting('header', defaultHeaderData, updates);
      return res.status(200).json({ success: true, data: headerSupa });
    }

    res.status(200).json({ success: true, data: headerMongo });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHeader, updateHeader, seedDefaultHeader };
