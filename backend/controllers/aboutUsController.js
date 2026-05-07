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
    const aboutUs = await AboutUs.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, data: aboutUs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
