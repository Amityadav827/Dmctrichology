const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  sectionId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Section', SectionSchema);
