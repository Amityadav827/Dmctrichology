const Hero = require('../models/Hero');

const seedDefaultHero = async () => {
  try {
    const count = await Hero.countDocuments();
    if (count === 0) {
      await Hero.create({
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
        ]
      });
      console.log("✅ Hero default data seeded.");
    }
  } catch (err) {
    console.error("❌ Error seeding hero data:", err.message);
  }
};

const getHero = async (req, res, next) => {
  try {
    const hero = await Hero.findOne();
    res.status(200).json({ success: true, data: hero });
  } catch (error) {
    next(error);
  }
};

const updateHero = async (req, res, next) => {
  try {
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
