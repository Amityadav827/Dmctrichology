const mongoose = require('mongoose');

const SurgeonSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  badgeText: { type: String, default: 'TRUSTED CARE SERVICES' },
  heading: { type: String, default: 'Meet Our Hair Transplant Surgeons' },
  surgeons: [
    {
      name: String,
      role: String,
      image: String,
      features: [String],
      buttonText: { type: String, default: 'Get Details' },
      buttonLink: { type: String, default: '#' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Surgeon', SurgeonSchema);
