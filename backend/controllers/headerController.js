const Header = require('../models/Header');

const seedDefaultHeader = async () => {
  try {
    const count = await Header.countDocuments();
    if (count === 0) {
      await Header.create({
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
      });
      console.log("✅ Header default data seeded.");
    }
  } catch (err) {
    console.error("❌ Error seeding header settings:", err.message);
  }
};

const getHeader = async (req, res, next) => {
  try {
    const header = await Header.findOne();
    res.status(200).json({ success: true, data: header });
  } catch (error) {
    next(error);
  }
};

const updateHeader = async (req, res, next) => {
  try {
    let header = await Header.findOne();
    if (!header) header = new Header();

    const updates = req.body;
    
    if (updates.logoUrl !== undefined) header.logoUrl = updates.logoUrl;
    if (updates.isSticky !== undefined) header.isSticky = updates.isSticky;
    if (updates.appointmentButtonText !== undefined) header.appointmentButtonText = updates.appointmentButtonText;
    if (updates.appointmentButtonLink !== undefined) header.appointmentButtonLink = updates.appointmentButtonLink;
    if (updates.menuItems !== undefined) header.menuItems = updates.menuItems;

    await header.save();
    res.status(200).json({ success: true, data: header });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHeader, updateHeader, seedDefaultHeader };
