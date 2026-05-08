const mongoose = require('mongoose');

const PressMediaSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: true },
  heading: { type: String, default: "WHAT THE PRESS AND MEDIA ARE SAYING ABOUT OUR CLINIC" },
  ratingText: { type: String, default: "4.9 Rating" },
  patientCountText: { type: String, default: "5000+ Satisfied Patients" },
  button: {
    text: { type: String, default: "EXPLORE MEDIA" },
    link: { type: String, default: "/media" }
  },
  avatars: [
    {
      id: String,
      image: String
    }
  ],
  mediaLogos: [
    {
      id: String,
      image: String,
      title: String,
      link: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('PressMedia', PressMediaSchema);
