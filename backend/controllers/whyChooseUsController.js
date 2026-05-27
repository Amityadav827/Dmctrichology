const WhyChooseUs = require('../models/WhyChooseUs');
const { getSingleton, updateSingleton } = require('../utils/supabaseSingletonHelper');

const defaultFeatures = [
  { icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/tcy9wy64djnagoimcfnx.png', title: 'Natural Results', desc: 'Every Hairline Is Designed To Match Your Facial Structure For A Natural Look.', side: 'left', enabled: true },
  { icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/ecjlnpbmt8rk3ebxazva.png', title: 'Customized Care', desc: 'Every Hair Loss Condition Is Different And Also Unique.', side: 'left', enabled: true },
  { icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/kganja8haq69bvurxro8.png', title: 'Reduce Surgical', desc: 'Techniques Like FUE Ensure Minimal Discomfort, No Linear Scars, And Quick Recovery.', side: 'right', enabled: true },
  { icon: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777548895/dmc-trichology/j8gecypsa2honobtknua.png', title: 'Complete Aftercare', desc: 'Our Team Supports You From Consultation To Full Hair Growth.', side: 'right', enabled: true }
];

const defaultData = {
  enabled: true,
  subtitle: 'Best Hair Graft Clinic',
  title: 'Why DMC Trichology Is The Best Hair Transplant Clinic In Delhi',
  centralImage: 'https://res.cloudinary.com/dseixl6px/image/upload/v1777550637/dmc-trichology/mprq5pm7g2utm2olrnj1.png',
  backgroundColor: '#ffffff',
  paddingTop: '0px',
  paddingBottom: '0px',
  showConnectorLines: true,
  showDots: true,
  features: defaultFeatures
};

exports.getWhyChooseUs = async (req, res) => {
  try {
    const supabaseData = await getSingleton('why_choose_us', defaultData);
    if (supabaseData) {
      console.log("⚡ [WhyChooseUs API] Returning GET request data from SUPABASE");
      return res.json({ success: true, data: supabaseData });
    }

    // --- Legacy MongoDB Code ---
    console.log("🍃 [WhyChooseUs API] Routing GET request to MONGODB");
    let data = await WhyChooseUs.findOne();
    if (!data) {
      data = await WhyChooseUs.create(defaultData);
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error('WhyChooseUs GET error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWhyChooseUs = async (req, res) => {
  try {
    const u = req.body;
    let parsedFeatures = u.features;
    if (parsedFeatures !== undefined) {
      try {
        parsedFeatures = typeof parsedFeatures === 'string' ? JSON.parse(parsedFeatures) : parsedFeatures;
      } catch (e) {
        console.error('Failed to parse features:', e.message);
      }
    }

    const updates = {};
    if (u.enabled !== undefined) updates.enabled = u.enabled;
    if (u.subtitle !== undefined) updates.subtitle = u.subtitle;
    if (u.title !== undefined) updates.title = u.title;
    if (u.centralImage !== undefined) updates.centralImage = u.centralImage;
    if (u.backgroundColor !== undefined) updates.backgroundColor = u.backgroundColor;
    if (u.paddingTop !== undefined) updates.paddingTop = u.paddingTop;
    if (u.paddingBottom !== undefined) updates.paddingBottom = u.paddingBottom;
    if (u.showConnectorLines !== undefined) updates.showConnectorLines = u.showConnectorLines;
    if (u.showDots !== undefined) updates.showDots = u.showDots;
    if (parsedFeatures !== undefined && Array.isArray(parsedFeatures)) {
      updates.features = parsedFeatures;
    }

    const supabaseData = await updateSingleton('why_choose_us', defaultData, updates);
    if (supabaseData) {
      console.log("⚡ [WhyChooseUs API] Returning UPDATE request data from SUPABASE");
      return res.json({ success: true, data: supabaseData, message: "WhyChooseUs updated successfully on Supabase" });
    }

    // --- Legacy MongoDB Code ---
    console.log("🍃 [WhyChooseUs API] Routing UPDATE request to MONGODB");
    let data = await WhyChooseUs.findOne();
    if (!data) {
      data = new WhyChooseUs();
    }

    if (u.enabled !== undefined) data.enabled = u.enabled;
    if (u.subtitle !== undefined) data.subtitle = u.subtitle;
    if (u.title !== undefined) data.title = u.title;
    if (u.centralImage !== undefined) data.centralImage = u.centralImage;
    if (u.backgroundColor !== undefined) data.backgroundColor = u.backgroundColor;
    if (u.paddingTop !== undefined) data.paddingTop = u.paddingTop;
    if (u.paddingBottom !== undefined) data.paddingBottom = u.paddingBottom;
    if (u.showConnectorLines !== undefined) data.showConnectorLines = u.showConnectorLines;
    if (u.showDots !== undefined) data.showDots = u.showDots;

    if (parsedFeatures !== undefined && Array.isArray(parsedFeatures)) {
      data.features = parsedFeatures;
      data.markModified('features');
    }

    await data.save();
    res.json({ success: true, data });
  } catch (error) {
    console.error('WhyChooseUs PUT error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
