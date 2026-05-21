const ScienceDmc = require('../models/ScienceDmc');

const defaultBulletsLeft = [
  'Microscopic Scalp Analysis',
  'Genetic Profiling',
  'Comprehensive Blood Panels'
];

const defaultBulletsRight = [
  'Custom Formulated Serums',
  'Targeted Laser Therapy',
  'Stem Cell Innovations'
];

exports.getScienceDmc = async (req, res) => {
  try {
    let data = await ScienceDmc.findOne();
    if (!data) {
      data = new ScienceDmc({
        dualFeatureSection: {
          isEnabled: true,
          leftCard: {
            title: 'Advanced Diagnostics',
            description: 'We utilize state-of-the-art diagnostic tools to understand the root cause of your hair loss.',
            bullets: defaultBulletsLeft,
            image: ''
          },
          rightCard: {
            title: 'Precision Treatment',
            description: 'Our treatments are tailored to your unique genetic and physiological profile for optimal results.',
            bullets: defaultBulletsRight,
            image: ''
          }
        }
      });
      await data.save();
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateScienceDmc = async (req, res) => {
  try {
    let data = await ScienceDmc.findOne();
    if (!data) data = new ScienceDmc();

    const u = req.body;

    if (u.hero !== undefined) data.hero = { ...data.hero.toObject?.() ?? data.hero, ...u.hero };
    if (u.introSection !== undefined) data.introSection = { ...data.introSection.toObject?.() ?? data.introSection, ...u.introSection };
    if (u.dualFeatureSection !== undefined) {
      data.dualFeatureSection = {
        isEnabled: u.dualFeatureSection.isEnabled !== undefined ? u.dualFeatureSection.isEnabled : data.dualFeatureSection.isEnabled,
        leftCard: u.dualFeatureSection.leftCard !== undefined ? { ...data.dualFeatureSection.leftCard.toObject?.() ?? data.dualFeatureSection.leftCard, ...u.dualFeatureSection.leftCard } : data.dualFeatureSection.leftCard,
        rightCard: u.dualFeatureSection.rightCard !== undefined ? { ...data.dualFeatureSection.rightCard.toObject?.() ?? data.dualFeatureSection.rightCard, ...u.dualFeatureSection.rightCard } : data.dualFeatureSection.rightCard,
      };
    }
    if (u.consultationSection !== undefined) data.consultationSection = { ...data.consultationSection.toObject?.() ?? data.consultationSection, ...u.consultationSection };

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
