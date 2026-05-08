const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  badgeText: { type: String, default: 'WHY CHOOSE US SERVICES' },
  heading: { type: String, default: 'REQUEST A CONSULTATION' },
  subtitle: { type: String, default: 'Clinic Timings ( By Appointments Only)' },
  phoneNumber: { type: String, default: '+91-8527830194' },
  serviceTimingMonSat: { type: String, default: '9:00 AM To 8:00 PM' },
  serviceTimingSunday: { type: String, default: '10:00 AM To 7:00 PM' },
  namePlaceholder: { type: String, default: 'Name*' },
  emailPlaceholder: { type: String, default: 'E-Mail Address*' },
  messagePlaceholder: { type: String, default: 'Enter Your Message Here*' },
  serviceOptions: { type: [String], default: ['Hair Transplant', 'Laser Hair Removal', 'Skin Treatment', 'Others'] },
  buttonText: { type: String, default: 'Schedule Your Visit' },
  beforeImage: { type: String, default: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png' },
  backgroundColor: { type: String, default: '#ffffff' }
}, { timestamps: true });

module.exports = mongoose.model('Consultation', ConsultationSchema);
