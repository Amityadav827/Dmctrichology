const HeroSection = require("../models/HeroSection");
const { uploadToCloudinary } = require("../utils/cloudinary");

// Seed default data if none exists
const seedDefaultHero = async () => {
  try {
    const count = await HeroSection.countDocuments();
    if (count === 0) {
      await HeroSection.create({
        heading: "EXPERIENCE THE ART OF NATURAL HAIR RESTORATION",
        subheading: "Trusted By Over 10,000+ Happy Patients For Life-Changing Results.",
        buttonText: "GET FREE CONSULTATION",
        buttonLink: "#",
        backgroundImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/hero-bg.jpg",
        trustedText: "Trusted by 10k+ Patients",
        formTitle: "Book Your Consultation",
        isActive: true
      });
      console.log("✅ Hero section default data seeded.");
    }
  } catch (error) {
    console.error("❌ Error seeding hero data:", error.message);
  }
};

// @desc    Get Hero section data
// @route   GET /api/hero
const getHero = async (req, res) => {
  try {
    let hero = await HeroSection.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!hero) {
      hero = await HeroSection.findOne().sort({ createdAt: -1 });
    }
    res.status(200).json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Hero section data
// @route   POST /api/hero
const createHero = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.backgroundImage = await uploadToCloudinary(req.file.buffer, "hero");
    }
    const hero = await HeroSection.create(body);
    res.status(201).json({ success: true, data: hero });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update Hero section data
// @route   PUT /api/hero/:id
const updateHero = async (req, res) => {
  try {
    const body = { ...req.body };
    if (req.file) {
      body.backgroundImage = await uploadToCloudinary(req.file.buffer, "hero");
    }
    const hero = await HeroSection.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!hero) {
      return res.status(404).json({ success: false, message: "Hero section not found" });
    }
    res.status(200).json({ success: true, data: hero });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete Hero section data
// @route   DELETE /api/hero/:id
const deleteHero = async (req, res) => {
  try {
    const hero = await HeroSection.findByIdAndDelete(req.params.id);
    if (!hero) {
      return res.status(404).json({ success: false, message: "Hero section not found" });
    }
    res.status(200).json({ success: true, message: "Hero section deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getHero,
  createHero,
  updateHero,
  deleteHero,
  seedDefaultHero
};
