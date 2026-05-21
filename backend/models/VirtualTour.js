const mongoose = require('mongoose');

const tourCardSchema = new mongoose.Schema({
  id: { type: String },
  image: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  buttonText: { type: String, default: 'View Space' },
  buttonLink: { type: String, default: '#' },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false });

const VirtualTourSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'Virtual Tour' },
    breadcrumbText: { type: String, default: 'Virtual Tour' },
    backgroundColor: { type: String, default: '#3b5998' },
    overlayOpacity: { type: Number, default: 0.55 },
    bannerHeight: { type: String, default: '420px' },
    bannerImage: { type: String, default: '' },
    ctaText: { type: String, default: 'Explore Clinic' },
    ctaLink: { type: String, default: '#tour-gallery' }
  },
  tourCards: [tourCardSchema]
}, { timestamps: true });

module.exports = mongoose.model('VirtualTour', VirtualTourSchema);
