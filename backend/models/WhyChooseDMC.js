const mongoose = require('mongoose');

const FeatureItemSchema = new mongoose.Schema({
  text: { type: String, default: '' },
  enabled: { type: Boolean, default: true }
});

const WhyChooseDMCSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  badgeText: { type: String, default: 'ABOUT US CARE' },
  heading: { type: String, default: 'WHY CHOOSE DMC TRICHOLOGY?' },
  description: { type: String, default: 'At DMC Trichology, A Top Hair Transplant Trichologist With Advanced Training And Expertise, And Committed Staff Members, Work To Provide Our Clients With Excellent Hair Loss And Hair Transplant Results.' },
  mainImage: { type: String, default: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777615993/dmc-trichology/nymnxvv9rzeyfjeif7oe.png' },
  bottomImage: { type: String, default: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777615993/dmc-trichology/xe3vngtetdirbpovotgi.png' },
  backgroundColor: { type: String, default: '#ffffff' },
  features: { type: [FeatureItemSchema], default: [] }
}, {
  timestamps: true
});

module.exports = mongoose.model('WhyChooseDMC', WhyChooseDMCSchema);
