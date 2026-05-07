const mongoose = require('mongoose');

const AboutUsSchema = new mongoose.Schema({
  subtitle: { type: String, default: 'ABOUT US CARE' },
  title: { type: String, default: 'WELCOME TO DMC TRICHOLOGY®' },
  description: { type: String, default: 'At DMC Trichology, Advanced Hair Transplant Techniques Restore Your Hairline And Boost Confidence' },
  stats: [
    {
      value: { type: String, default: '2k+' },
      label: { type: String, default: 'Patients Healed' },
      subText: { type: String, default: 'Experience Compassionate Care Healthier Care Certified Brighter Smile.' }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AboutUs', AboutUsSchema);
