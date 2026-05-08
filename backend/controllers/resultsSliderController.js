const ResultsSlider = require('../models/ResultsSlider');

const defaultResults = [
  { title: 'Korean Facial Illumination', beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/dvy3knew0pzq1gg8fr8q.png', afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/uttbdof06l4xbpvexlv9.png', sessions: 'After 6 sessions' },
  { title: 'Acne Arrestor Facial With Salicylic Peel', beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/g7fs5kfpckmmcjwg5sk0.png', afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612758/dmc-trichology/zxyvkmr0uf8pf5qxgfvf.png', sessions: 'After 4 sessions' },
  { title: 'Elastin Boost Facial', beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/meeed3zg8w5j3xhkcfxc.png', afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/w6qder12vvhxrbhzskgw.png', sessions: 'After 5 sessions' },
  { title: 'Derma Revive Facial', beforeImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/dh6webh6x4l7qfrlzxtl.png', afterImg: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777612757/dmc-trichology/bif89jyygbycclg8qa92.png', sessions: 'After 4 sessions' }
];

exports.getResultsSlider = async (req, res) => {
  try {
    let data = await ResultsSlider.findOne();
    if (!data) {
      data = await ResultsSlider.create({
        enabled: true,
        badgeText: 'BEFORE AND AFTER',
        heading: 'Results that speak for themselves',
        backgroundColor: '#FFFAF1',
        results: defaultResults
      });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateResultsSlider = async (req, res) => {
  try {
    let data = await ResultsSlider.findOne();
    if (!data) data = new ResultsSlider();

    const u = req.body;
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
