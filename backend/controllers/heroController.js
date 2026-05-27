const Hero = require('../models/Hero');
const { getSingleton, updateSingleton } = require('../utils/supabaseSingletonHelper');

const defaultData = {
  slides: [
    {
      tag: "DMC TRICHOLOGY",
      title: "Experience The Art Of Natural Hair Restoration",
      description: "Advanced techniques tailored for your unique needs. Restore your confidence with our expert surgeons.",
      backgroundImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/xun9sghr8p0bmbdf8p1r.png",
      primaryBtnText: "Book Appointment",
      primaryBtnLink: "/book-appointment"
    },
    {
      tag: "BEST HAIR CLINIC",
      title: "World-Class Hair Transplant Technology",
      description: "Using the latest FUE & DHT techniques for maximum density and natural-looking results.",
      backgroundImage: "https://res.cloudinary.com/dseixl6px/image/upload/v1777530477/dmc-trichology/vtticvun32as1q2v6zxs.png",
      primaryBtnText: "Our Services",
      primaryBtnLink: "/services"
    }
  ],
  isActive: true
};

const seedDefaultHero = async () => {
  try {
    const count = await Hero.countDocuments();
    if (count === 0) {
      await Hero.create(defaultData);
      console.log("✅ Hero default data seeded.");
    }
  } catch (err) {
    console.error("❌ Error seeding hero data:", err.message);
  }
};

const getHero = async (req, res, next) => {
  try {
    const supabaseData = await getSingleton('hero', defaultData);
    if (supabaseData) {
      console.log("⚡ [Hero API] Returning GET request data from SUPABASE");
      return res.status(200).json({ success: true, data: supabaseData });
    }

    // --- Legacy MongoDB Code ---
    console.log("🍃 [Hero API] Routing GET request to MONGODB");
    const hero = await Hero.findOne();
    res.status(200).json({ success: true, data: hero || defaultData });
  } catch (error) {
    next(error);
  }
};

const updateHero = async (req, res, next) => {
  try {
    const updates = {
      slides: req.body.slides,
      isActive: req.body.isActive ?? true
    };

    const supabaseData = await updateSingleton('hero', defaultData, updates);
    if (supabaseData) {
      console.log("⚡ [Hero API] Returning UPDATE request data from SUPABASE");
      return res.status(200).json({ success: true, data: supabaseData, message: "Hero settings updated successfully on Supabase" });
    }

    // --- Legacy MongoDB Code ---
    console.log("🍃 [Hero API] Routing UPDATE request to MONGODB");
    let hero = await Hero.findOne();
    if (!hero) hero = new Hero();

    hero.slides = req.body.slides;
    hero.isActive = req.body.isActive ?? true;

    await hero.save();
    res.status(200).json({ success: true, data: hero });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHero, updateHero, seedDefaultHero };
