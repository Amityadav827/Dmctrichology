const ResultsSlider = require('../models/ResultsSlider');
const { getSingleton, updateSingleton } = require('../utils/supabaseSingletonHelper');

const defaultResults = [
  { title: 'Korean Facial Illumination', beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/dvy3knew0pzq1gg8fr8q.png', afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/uttbdof06l4xbpvexlv9.png', sessions: 'After 6 sessions' },
  { title: 'Acne Arrestor Facial With Salicylic Peel', beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/g7fs5kfpckmmcjwg5sk0.png', afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/zxyvkmr0uf8pf5qxgfvf.png', sessions: 'After 4 sessions' },
  { title: 'Elastin Boost Facial', beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/meeed3zg8w5j3xhkcfxc.png', afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/w6qder12vvhxrbhzskgw.png', sessions: 'After 5 sessions' },
  { title: 'Derma Revive Facial', beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dh6webh6x4l7qfrlzxtl.png', afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/bif89jyygbycclg8qa92.png', sessions: 'After 4 sessions' }
];

const defaultData = {
  enabled: true,
  badgeText: 'BEFORE AND AFTER',
  heading: 'Results that speak for themselves',
  backgroundColor: '#FFFAF1',
  results: defaultResults
};

exports.getResultsSlider = async (req, res) => {
  try {
    const supabaseData = await getSingleton('results_slider', defaultData);
    if (supabaseData) {
      console.log("⚡ [ResultsSlider API] Returning GET request data from SUPABASE");
      return res.json({ success: true, data: supabaseData });
    }

    // --- Legacy MongoDB Code ---
    console.log("🍃 [ResultsSlider API] Routing GET request to MONGODB");
    let data = await ResultsSlider.findOne();
    if (!data) {
      data = await ResultsSlider.create(defaultData);
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateResultsSlider = async (req, res) => {
  try {
    const u = req.body;
    const updates = {};
    if (u.enabled !== undefined) updates.enabled = u.enabled;
    if (u.badgeText !== undefined) updates.badgeText = u.badgeText;
    if (u.heading !== undefined) updates.heading = u.heading;
    if (u.backgroundColor !== undefined) updates.backgroundColor = u.backgroundColor;
    if (u.results !== undefined) updates.results = u.results;

    const supabaseData = await updateSingleton('results_slider', defaultData, updates);
    if (supabaseData) {
      console.log("⚡ [ResultsSlider API] Returning UPDATE request data from SUPABASE");
      return res.json({ success: true, data: supabaseData, message: "ResultsSlider updated successfully on Supabase" });
    }

    // --- Legacy MongoDB Code ---
    console.log("🍃 [ResultsSlider API] Routing UPDATE request to MONGODB");
    let data = await ResultsSlider.findOne();
    if (!data) data = new ResultsSlider();

    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.badgeText !== undefined) data.badgeText = u.badgeText;
    if (u.heading !== undefined) data.heading = u.heading;
    if (u.backgroundColor !== undefined) data.backgroundColor = u.backgroundColor;

    if (u.results !== undefined) {
      data.results = u.results;
      data.markModified('results');
    }

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
