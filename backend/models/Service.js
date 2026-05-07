const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  subtitle: { type: String, default: 'SERVICES' },
  title: { type: String, default: 'Our Hair Transplant Services' },
  viewAllText: { type: String, default: 'View All' },
  viewAllLink: { type: String, default: '#' },
  services: [
    {
      title: String,
      image: String,
      link: { type: String, default: '#' }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', ServiceSchema);
