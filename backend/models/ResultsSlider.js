const mongoose = require('mongoose');

const ResultItemSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  beforeImg: { type: String, default: '' },
  afterImg: { type: String, default: '' },
  sessions: { type: String, default: '' },
  enabled: { type: Boolean, default: true }
});

const ResultsSliderSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  badgeText: { type: String, default: 'BEFORE AND AFTER' },
  heading: { type: String, default: 'Results that speak for themselves' },
  backgroundColor: { type: String, default: '#FFFAF1' },
  results: { type: [ResultItemSchema], default: [] }
}, {
  timestamps: true
});

module.exports = mongoose.model('ResultsSlider', ResultsSliderSchema);
