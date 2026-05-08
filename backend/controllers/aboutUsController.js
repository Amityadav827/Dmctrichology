const AboutUs = require('../models/AboutUs');

exports.getAboutUs = async (req, res) => {
  try {
    let aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      aboutUs = await AboutUs.create({
        subtitle: 'ABOUT US CARE',
        title: 'WELCOME TO DMC TRICHOLOGY®',
        description: 'At DMC Trichology, Advanced Hair Transplant Techniques Restore Your Hairline And Boost Confidence',
        stats: [
          { value: '2k+', label: 'Patients Healed', description: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.', showDivider: true },
          { value: '15+', label: 'Certified Doctors', description: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.', showDivider: true },
          { value: '4.9', label: 'Average Patient Rating', description: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.', showDivider: true },
          { value: '100+', label: 'New Equipments', description: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.', showDivider: true }
        ]
      });
    }
    res.json({ success: true, data: aboutUs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAboutUs = async (req, res) => {
  try {
    let aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      aboutUs = new AboutUs();
    }

    const updates = req.body;

    // Explicitly update each field so Mongoose tracks changes (markModified)
    if (updates.subtitle !== undefined) aboutUs.subtitle = updates.subtitle;
    if (updates.title !== undefined) aboutUs.title = updates.title;
    if (updates.description !== undefined) aboutUs.description = updates.description;
    if (updates.icon !== undefined) aboutUs.icon = updates.icon;

    if (updates.stats !== undefined) {
      try {
        const parsedStats = typeof updates.stats === 'string' ? JSON.parse(updates.stats) : updates.stats;
        if (Array.isArray(parsedStats)) {
          aboutUs.stats = parsedStats;
          aboutUs.markModified('stats');
        }
      } catch (e) {
        console.error('Failed to parse stats array:', e.message);
      }
    }

    aboutUs.updatedAt = new Date();
    await aboutUs.save();

    res.json({ success: true, data: aboutUs });
  } catch (error) {
    console.error('AboutUs update error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
