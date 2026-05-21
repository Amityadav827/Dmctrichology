const mongoose = require('mongoose');

const ScienceConsultationLeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, default: 'Hair Restoration' },
  appointmentDate: { type: Date, required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['new', 'contacted', 'scheduled', 'converted'], default: 'new' },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ScienceConsultationLead', ScienceConsultationLeadSchema);
