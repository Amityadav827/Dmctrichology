const PressMedia = require('../models/PressMedia');
const { useSupabase, getSingleton, updateSingleton } = require('../utils/supabaseSingletonHelper');

// ─── Default data ─────────────────────────────────────────────────────────────
const defaultAvatars = [
  { id: '1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png' },
  { id: '2', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png' },
  { id: '3', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png' },
  { id: '4', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777530476/dmc-trichology/qytwlafbixtw14egkncm.png' },
];

const defaultLogos = [
  { id: '1', title: 'Press 1', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/rervxi6jq1fl20lu2fps.png', link: '#' },
  { id: '2', title: 'Press 2', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/pvyogcawczl9mv7wb82v.png', link: '#' },
  { id: '3', title: 'Press 3', image: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777700309/dmc-trichology/tixdm9gnhknxtwvlj3xd.png', link: '#' },
];

const defaultMediaCards = [
  {
    id: '1',
    mediaImage: 'https://www.dmctrichology.com/assets/images/media_1.webp',
    mediaLogo: 'https://www.dmctrichology.com/assets/images/media_logo1.webp',
    mediaTitle: 'DMC Trichology Featured in Leading Health Publication',
    mediaLink: '#',
    isVisible: true,
    order: 0,
  },
  {
    id: '2',
    mediaImage: 'https://www.dmctrichology.com/assets/images/media_1.webp',
    mediaLogo: 'https://www.dmctrichology.com/assets/images/media_logo1.webp',
    mediaTitle: 'Expert Hair Restoration: DMC Trichology\'s Revolutionary Approach',
    mediaLink: '#',
    isVisible: true,
    order: 1,
  },
  {
    id: '3',
    mediaImage: 'https://www.dmctrichology.com/assets/images/media_1.webp',
    mediaLogo: 'https://www.dmctrichology.com/assets/images/media_logo1.webp',
    mediaTitle: 'India\'s Premier Trichology Clinic Gains National Recognition',
    mediaLink: '#',
    isVisible: true,
    order: 2,
  },
];

const defaultPressMediaData = {
  hero: {
    title: 'Press & Media',
    breadcrumbText: 'Press & Media',
    bannerImage: '',
    backgroundColor: '#3b5998',
    overlayOpacity: 0.55,
    bannerHeight: '420px',
  },
  mediaCards: defaultMediaCards,
  enabled: true,
  heading: 'WHAT THE PRESS AND MEDIA ARE SAYING ABOUT OUR CLINIC',
  ratingText: '4.9 Rating',
  patientCountText: '5000+ Satisfied Patients',
  button: { text: 'EXPLORE MEDIA', link: '/press-media' },
  avatars: defaultAvatars,
  mediaLogos: defaultLogos,
};

// ─── GET /api/press-media ─────────────────────────────────────────────────────
exports.getPressMedia = async (req, res) => {
  try {
    // Supabase path (USE_SUPABASE_FOR_HOMEPAGE=true)
    if (useSupabase()) {
      const data = await getSingleton('press_media', defaultPressMediaData);
      console.log("⚡ [PressMedia API] Returning GET from SUPABASE");
      return res.json({ success: true, data });
    }

    // MongoDB fallback
    console.log("🍃 [PressMedia API] Routing GET to MONGODB");
    let data = await PressMedia.findOne();
    if (!data) {
      data = await PressMedia.create({
        avatars: defaultAvatars,
        mediaLogos: defaultLogos,
        mediaCards: defaultMediaCards,
      });
    }
    // Ensure mediaCards is always populated with sample data if empty
    if (!data.mediaCards || data.mediaCards.length === 0) {
      data.mediaCards = defaultMediaCards;
      await data.save();
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/press-media ─────────────────────────────────────────────────────
exports.updatePressMedia = async (req, res) => {
  try {
    const u = req.body;
    const updates = {};

    if (u.enabled !== undefined) updates.enabled = u.enabled;
    if (u.heading !== undefined) updates.heading = u.heading;
    if (u.ratingText !== undefined) updates.ratingText = u.ratingText;
    if (u.patientCountText !== undefined) updates.patientCountText = u.patientCountText;
    if (u.button !== undefined) updates.button = u.button;
    if (u.avatars !== undefined) updates.avatars = u.avatars;
    if (u.mediaLogos !== undefined) updates.mediaLogos = u.mediaLogos;
    if (u.hero !== undefined) updates.hero = u.hero;
    if (u.mediaCards !== undefined) updates.mediaCards = u.mediaCards;

    // Supabase path — dual-write: MongoDB first
    let mongoData = await PressMedia.findOne();
    if (!mongoData) mongoData = new PressMedia();

    if (u.enabled !== undefined) mongoData.enabled = u.enabled;
    if (u.heading !== undefined) mongoData.heading = u.heading;
    if (u.ratingText !== undefined) mongoData.ratingText = u.ratingText;
    if (u.patientCountText !== undefined) mongoData.patientCountText = u.patientCountText;
    if (u.button !== undefined) mongoData.button = u.button;
    if (u.avatars !== undefined) mongoData.avatars = u.avatars;
    if (u.mediaLogos !== undefined) mongoData.mediaLogos = u.mediaLogos;
    if (u.hero !== undefined) mongoData.hero = { ...mongoData.hero?.toObject?.() ?? mongoData.hero, ...u.hero };
    if (u.mediaCards !== undefined) mongoData.mediaCards = u.mediaCards;
    await mongoData.save();

    if (useSupabase()) {
      const supaData = await updateSingleton('press_media', defaultPressMediaData, updates);
      console.log("⚡ [PressMedia API] Returning UPDATE from SUPABASE");
      return res.json({ success: true, data: supaData });
    }

    res.json({ success: true, data: mongoData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
