const Influencer = require('../models/Influencer');
const { useSupabase, getSingleton, updateSingleton } = require('../utils/supabaseSingletonHelper');

const defaultInfluencerCards = [
  {
    id: '1',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    autoplay: false,
    muted: true,
    loop: true,
    isVisible: true,
    order: 0
  }
];

const defaultInfluencerData = {
  hero: {
    title: 'Influencers',
    breadcrumbText: 'Influencers',
    backgroundColor: '#3b5998',
    overlayOpacity: 0.55,
    bannerHeight: '420px',
    bannerImage: '',
    ctaText: 'Watch Stories',
    ctaLink: '#influencer-showcase'
  },
  influencerCards: defaultInfluencerCards
};

exports.getInfluencers = async (req, res) => {
  try {
    // Supabase path (USE_SUPABASE_FOR_HOMEPAGE=true)
    if (useSupabase()) {
      const data = await getSingleton('influencers', defaultInfluencerData);
      console.log("⚡ [Influencer API] Returning GET from SUPABASE");
      return res.json({ success: true, data });
    }

    // MongoDB fallback
    console.log("🍃 [Influencer API] Routing GET to MONGODB");
    let data = await Influencer.findOne();
    if (!data) {
      data = await Influencer.create({ influencerCards: defaultInfluencerCards });
    }
    if (!data.influencerCards || data.influencerCards.length === 0) {
      data.influencerCards = defaultInfluencerCards;
      await data.save();
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInfluencers = async (req, res) => {
  try {
    const u = req.body;
    const updates = {};

    if (u.hero !== undefined) updates.hero = u.hero;
    if (u.influencerCards !== undefined) updates.influencerCards = u.influencerCards;

    // Dual-write: MongoDB first (rollback backup)
    let mongoData = await Influencer.findOne();
    if (!mongoData) mongoData = new Influencer();

    if (u.hero !== undefined) mongoData.hero = { ...mongoData.hero?.toObject?.() ?? mongoData.hero, ...u.hero };
    if (u.influencerCards !== undefined) mongoData.influencerCards = u.influencerCards;
    await mongoData.save();

    if (useSupabase()) {
      const supaData = await updateSingleton('influencers', defaultInfluencerData, updates);
      console.log("⚡ [Influencer API] Returning UPDATE from SUPABASE");
      return res.json({ success: true, data: supaData });
    }

    res.json({ success: true, data: mongoData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
