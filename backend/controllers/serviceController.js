const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    let serviceData = await Service.findOne();
    if (!serviceData) {
      serviceData = await Service.create({
        subtitle: 'SERVICES',
        title: 'Our Hair Transplant Services',
        viewAllText: 'View All',
        viewAllLink: '#',
        services: [
          { title: "Follicular Unit Extraction (FUE)", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/dnnerjyyebzufaoya4hd.png" },
          { title: "Follicular Unit Transplantation (FUT)", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709678/dmc-trichology/scwz5ugmiwn9npmzpk5d.png" },
          { title: "Hair Replacement In Delhi – Non-Surgical Solutions", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709678/dmc-trichology/l141dtwrmlhc3xm8tlir.png" },
          { title: "Scalp Treatments For Healthy Hair", image: "https://res.cloudinary.com/dseixl6px/image/upload/v1777709679/dmc-trichology/kuhwci9p4pp7r7mzmxof.png" }
        ]
      });
    }
    res.json({ success: true, data: serviceData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateServices = async (req, res) => {
  try {
    const serviceData = await Service.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, data: serviceData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
