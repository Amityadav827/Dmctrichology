const Page = require('../models/Page');

const seedHomePage = async () => {
  try {
    const home = await Page.findOne({ slug: 'home' });
    if (!home) {
      await Page.create({
        title: "Home Page",
        slug: "home",
        sections: [
          { sectionId: "topbar", type: "global", order: 0, isActive: true },
          { sectionId: "header", type: "global", order: 1, isActive: true },
          { sectionId: "hero", type: "section", order: 2, isActive: true },
          { sectionId: "about-us", type: "section", order: 3, isActive: true },
          { sectionId: "services", type: "section", order: 4, isActive: true },
          { sectionId: "footer", type: "global", order: 100, isActive: true }
        ],
        metadata: {
          title: "DMC Trichology | Best Hair Transplant Clinic In Delhi",
          description: "Experience The Art Of Natural Hair Restoration at DMC Trichology."
        }
      });
      console.log("✅ Home Page Composition seeded.");
    }
  } catch (err) {
    console.error("❌ Error seeding page data:", err.message);
  }
};

const getPageBySlug = async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

const updatePageComposition = async (req, res, next) => {
  try {
    const page = await Page.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPageBySlug, updatePageComposition, seedHomePage };
