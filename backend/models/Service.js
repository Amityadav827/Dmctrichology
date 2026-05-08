const mongoose = require('mongoose');

const ServiceItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  image: { type: String, default: '' },
  link: { type: String, default: '#' }
});

const ServiceSchema = new mongoose.Schema({
  subtitle: { type: String, default: 'SERVICES' },
  title: { type: String, default: 'Our Hair Transplant Services' },
  viewAllText: { type: String, default: 'View All' },
  viewAllLink: { type: String, default: '#' },
  services: { type: [ServiceItemSchema], default: [] }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema);
