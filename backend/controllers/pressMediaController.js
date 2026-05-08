const PressMedia = require('../models/PressMedia');

const defaultAvatars = [
  { id: '1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/patient1.png' },
  { id: '2', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/patient2.png' },
  { id: '3', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/patient3.png' }
];

const defaultLogos = [
  { id: '1', title: 'Elle', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777698274/dmc-trichology/logo1.png', link: '#' },
  { id: '2', title: 'Vogue', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777698274/dmc-trichology/logo2.png', link: '#' },
  { id: '3', title: 'Grazia', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777698274/dmc-trichology/logo3.png', link: '#' }
];

exports.getPressMedia = async (req, res) => {
  try {
    let data = await PressMedia.findOne();
    if (!data) {
      data = await PressMedia.create({
        avatars: defaultAvatars,
        mediaLogos: defaultLogos
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePressMedia = async (req, res) => {
  try {
    let data = await PressMedia.findOne();
    if (!data) data = new PressMedia();

    const u = req.body;
    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.heading !== undefined) data.heading = u.heading;
    if (u.ratingText !== undefined) data.ratingText = u.ratingText;
    if (u.patientCountText !== undefined) data.patientCountText = u.patientCountText;
    if (u.button !== undefined) data.button = u.button;
    if (u.avatars !== undefined) data.avatars = u.avatars;
    if (u.mediaLogos !== undefined) data.mediaLogos = u.mediaLogos;

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
