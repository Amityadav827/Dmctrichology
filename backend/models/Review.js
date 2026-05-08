const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  badgeText: { type: String, default: 'REVIEWS' },
  heading: { type: String, default: 'See the Results. Hear the Stories.' },
  googleReviewText: { type: String, default: '7000+ Reviews on' },
  reviews: [
    {
      name: String,
      text: String,
      rating: { type: Number, default: 5 }
    }
  ],
  videos: [
    {
      name: String,
      image: String,
      url: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
