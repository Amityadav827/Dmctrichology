const WhyChooseDMC = require('../models/WhyChooseDMC');

const defaultFeatures = [
  { text: "Golden Technique", enabled: true },
  { text: "Minimal Procedure", enabled: true },
  { text: "Natural Results", enabled: true },
  { text: "Safe Procedure", enabled: true },
  { text: "Expert Team", enabled: true },
  { text: "Affordable Quality", enabled: true },
  { text: "FUE MesoGrow", enabled: true },
  { text: "Top Trichologist", enabled: true }
];

exports.getWhyChooseDMC = async (req, res) => {
  try {
    let data = await WhyChooseDMC.findOne();
    if (!data) {
      data = await WhyChooseDMC.create({
        enabled: true,
        badgeText: 'ABOUT US CARE',
        heading: 'WHY CHOOSE DMC TRICHOLOGY?',
        description: 'At DMC Trichology, A Top Hair Transplant Trichologist With Advanced Training And Expertise, And Committed Staff Members, Work To Provide Our Clients With Excellent Hair Loss And Hair Transplant Results.',
        mainImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777615993/dmc-trichology/nymnxvv9rzeyfjeif7oe.png',
        bottomImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777615993/dmc-trichology/xe3vngtetdirbpovotgi.png',
        backgroundColor: '#ffffff',
        features: defaultFeatures
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWhyChooseDMC = async (req, res) => {
  try {
    let data = await WhyChooseDMC.findOne();
    if (!data) data = new WhyChooseDMC();

    const u = req.body;
    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.badgeText !== undefined) data.badgeText = u.badgeText;
    if (u.heading !== undefined) data.heading = u.heading;
    if (u.description !== undefined) data.description = u.description;
    if (u.mainImage !== undefined) data.mainImage = u.mainImage;
    if (u.bottomImage !== undefined) data.bottomImage = u.bottomImage;
    if (u.backgroundColor !== undefined) data.backgroundColor = u.backgroundColor;

    if (u.features !== undefined) {
      data.features = u.features;
      data.markModified('features');
    }

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
