const Consultation = require('../models/Consultation');

exports.getConsultation = async (req, res) => {
  try {
    let data = await Consultation.findOne();
    if (!data) {
      data = await Consultation.create({
        badgeText: 'WHY CHOOSE US SERVICES',
        heading: 'REQUEST A CONSULTATION',
        subtitle: 'Clinic Timings ( By Appointments Only)',
        phoneNumber: '+91-8527830194',
        serviceTimingMonSat: '9:00 AM To 8:00 PM',
        serviceTimingSunday: '10:00 AM To 7:00 PM',
        namePlaceholder: 'Name*',
        emailPlaceholder: 'E-Mail Address*',
        messagePlaceholder: 'Enter Your Message Here*',
        serviceOptions: ['Hair Transplant', 'Laser Hair Removal', 'Skin Treatment', 'Others'],
        buttonText: 'Schedule Your Visit',
        beforeImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777623481/dmc-trichology/sfqfld2ikbs00iqncyse.png',
        backgroundColor: '#ffffff'
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateConsultation = async (req, res) => {
  try {
    let data = await Consultation.findOne();
    if (!data) data = new Consultation();

    const u = req.body;
    const fields = [
      'enabled', 'badgeText', 'heading', 'subtitle', 'phoneNumber', 
      'serviceTimingMonSat', 'serviceTimingSunday', 'namePlaceholder', 
      'emailPlaceholder', 'messagePlaceholder', 'serviceOptions', 
      'buttonText', 'beforeImage', 'backgroundColor'
    ];
    
    fields.forEach(field => {
      if (u[field] !== undefined) data[field] = u[field];
    });

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
