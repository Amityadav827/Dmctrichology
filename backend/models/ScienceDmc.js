const mongoose = require('mongoose');

const ScienceDmcSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'Science at DMC Trichology' },
    subtitle: { type: String, default: 'ADVANCED HAIR RESTORATION SCIENCE' },
    breadcrumbText: { type: String, default: 'Science at DMC Trichology' },
    backgroundColor: { type: String, default: '#3b5998' },
    overlayOpacity: { type: Number, default: 0.55 },
    bannerHeight: { type: String, default: '60vh' },
    bannerImage: { type: String, default: '' },
    ctaText: { type: String, default: 'Book Consultation' },
    ctaLink: { type: String, default: '#consultation' },
    isEnabled: { type: Boolean, default: true }
  },
  introSection: {
    heading: { type: String, default: 'The Science Behind Hair Restoration' },
    description: { type: String, default: 'At DMC Trichology, we blend cutting-edge medical science with artistic precision to deliver natural-looking hair restoration. Our protocols are rooted in evidence-based medicine.' },
    backgroundImage: { type: String, default: '' },
    isEnabled: { type: Boolean, default: true }
  },
  dualFeatureSection: {
    isEnabled: { type: Boolean, default: true },
    leftCard: {
      title: { type: String, default: 'Advanced Diagnostics' },
      description: { type: String, default: 'We utilize state-of-the-art diagnostic tools to understand the root cause of your hair loss.' },
      bullets: [{ type: String }],
      image: { type: String, default: '' }
    },
    rightCard: {
      title: { type: String, default: 'Precision Treatment' },
      description: { type: String, default: 'Our treatments are tailored to your unique genetic and physiological profile for optimal results.' },
      bullets: [{ type: String }],
      image: { type: String, default: '' }
    }
  },
  consultationSection: {
    title: { type: String, default: 'Begin Your Journey' },
    timingText: { type: String, default: 'Available Mon - Sat: 10:00 AM - 7:00 PM' },
    backgroundColor: { type: String, default: '#0D0D1A' },
    backgroundImage: { type: String, default: '' },
    isEnabled: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('ScienceDmc', ScienceDmcSchema);
