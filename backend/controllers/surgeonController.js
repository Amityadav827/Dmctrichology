const Surgeon = require('../models/Surgeon');

const defaultSurgeons = [
  {
    name: 'Dr. Nandani Dadu',
    role: 'MBBS, A Board-Certified Trichologist, Has Been Studying Hair And Scalp Treatments For Over Ten Years.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777621065/dmc-trichology/bdobupruhaxajozumydn.png',
    features: [
      'Recover Stronger With Expert Orthopedic Rehabilitation',
      'Restoring Strength, Mobility, And Joint Health',
      'Comprehensive Care For Bones And Joints'
    ],
    buttonText: 'Get Details',
    buttonLink: '#'
  },
  {
    name: 'Dr. Nivedita Dadu',
    role: 'Expert Dermatologist and Hair Transplant Specialist with extensive experience in clinical dermatology.',
    image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777621065/dmc-trichology/bdobupruhaxajozumydn.png',
    features: [
      'Advanced Skin and Hair Solutions',
      'Personalized Patient Care',
      'Innovative Treatment Methods'
    ],
    buttonText: 'Get Details',
    buttonLink: '#'
  }
];

exports.getSurgeons = async (req, res) => {
  try {
    let data = await Surgeon.findOne();
    if (!data) {
      data = await Surgeon.create({
        badgeText: 'TRUSTED CARE SERVICES',
        heading: 'Meet Our Hair Transplant Surgeons',
        surgeons: defaultSurgeons
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSurgeons = async (req, res) => {
  try {
    let data = await Surgeon.findOne();
    if (!data) data = new Surgeon();

    const u = req.body;
    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.badgeText !== undefined) data.badgeText = u.badgeText;
    if (u.heading !== undefined) data.heading = u.heading;
    if (u.surgeons !== undefined) data.surgeons = u.surgeons;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
