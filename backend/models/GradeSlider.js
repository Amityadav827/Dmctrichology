const mongoose = require('mongoose');

const GradeItemSchema = new mongoose.Schema({
  grade: { type: String, default: '' },
  displayNum: { type: String, default: '' },
  area: { type: String, default: '' },
  density: { type: String, default: '' },
  grafts: { type: String, default: '' },
  session: { type: String, default: '' },
  image: { type: String, default: '' },
  enabled: { type: Boolean, default: true }
});

const GradeSliderSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  badgeText: { type: String, default: 'EQUIP YOUR RECOVERY' },
  heading: { type: String, default: 'Know Your Grade For Hair Transplant' },
  backgroundColor: { type: String, default: '#000000' },
  grades: { type: [GradeItemSchema], default: [] }
}, {
  timestamps: true
});

module.exports = mongoose.model('GradeSlider', GradeSliderSchema);
