const ServicePageSettings = require("../models/ServicePageSettings");

exports.getSettings = async (req, res) => {
  try {
    let settings = await ServicePageSettings.findOne();
    if (!settings) {
      settings = await ServicePageSettings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await ServicePageSettings.findOne();
    if (!settings) {
      settings = await ServicePageSettings.create(req.body);
    } else {
      settings = await ServicePageSettings.findOneAndUpdate({}, req.body, { new: true });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
