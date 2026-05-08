const Service = require('../models/Service');

const defaultServices = [
  { title: "Follicular Unit Extraction (FUE)", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png", link: "#" },
  { title: "Follicular Unit Transplantation (FUT)", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709678/dmc-trichology/scwz5ugmiwn9npmzpk5d.png", link: "#" },
  { title: "Hair Replacement In Delhi – Non-Surgical Solutions", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709678/dmc-trichology/l141dtwrmlhc3xm8tlir.png", link: "#" },
  { title: "Scalp Treatments For Healthy Hair", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/kuhwci9p4pp7r7mzmxof.png", link: "#" }
];

exports.getServices = async (req, res) => {
  try {
    let serviceData = await Service.findOne();
    if (!serviceData) {
      serviceData = await Service.create({
        subtitle: 'SERVICES',
        title: 'Our Hair Transplant Services',
        viewAllText: 'View All',
        viewAllLink: '#',
        services: defaultServices
      });
    }
    res.json({ success: true, data: serviceData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateServices = async (req, res) => {
  try {
    let serviceData = await Service.findOne();
    if (!serviceData) {
      serviceData = new Service();
    }

    const updates = req.body;

    if (updates.subtitle !== undefined) serviceData.subtitle = updates.subtitle;
    if (updates.title !== undefined) serviceData.title = updates.title;
    if (updates.viewAllText !== undefined) serviceData.viewAllText = updates.viewAllText;
    if (updates.viewAllLink !== undefined) serviceData.viewAllLink = updates.viewAllLink;

    if (updates.services !== undefined) {
      try {
        const parsed = typeof updates.services === 'string'
          ? JSON.parse(updates.services)
          : updates.services;
        if (Array.isArray(parsed)) {
          serviceData.services = parsed;
          serviceData.markModified('services');
        }
      } catch (e) {
        console.error('Failed to parse services array:', e.message);
      }
    }

    await serviceData.save();
    res.json({ success: true, data: serviceData });
  } catch (error) {
    console.error('Services update error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
