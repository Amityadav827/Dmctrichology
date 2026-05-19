const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  service: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  message: { type: String, default: "" },
  status: { 
    type: String, 
    default: "new", 
    enum: ["new", "contacted", "scheduled", "converted"] 
  },
  notes: { type: String, default: "" }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
