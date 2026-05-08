const mongoose = require('mongoose');

const FeatureCardSchema = new mongoose.Schema({
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  side: { type: String, enum: ['left', 'right'], default: 'left' },
  enabled: { type: Boolean, default: true }
});

const WhyChooseUsSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  subtitle: { type: String, default: 'Best Hair Graft Clinic' },
  title: { type: String, default: 'Why DMC Trichology Is The Best Hair Transplant Clinic In Delhi' },
  centralImage: { type: String, default: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777550637/dmc-trichology/mprq5pm7g2utm2olrnj1.png' },
  backgroundColor: { type: String, default: '#ffffff' },
  paddingTop: { type: String, default: '0px' },
  paddingBottom: { type: String, default: '0px' },
  showConnectorLines: { type: Boolean, default: true },
  showDots: { type: Boolean, default: true },
  features: { type: [FeatureCardSchema], default: [] }
}, {
  timestamps: true
});

module.exports = mongoose.model('WhyChooseUs', WhyChooseUsSchema);
