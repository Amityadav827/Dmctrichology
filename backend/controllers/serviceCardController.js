const ServiceCard = require("../models/ServiceCard");

exports.getServices = async (req, res) => {
  try {
    const services = await ServiceCard.find().sort({ sortOrder: 1 });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await ServiceCard.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await ServiceCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    await ServiceCard.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkUpdate = async (req, res) => {
    try {
        const { services } = req.body;
        for (const s of services) {
            await ServiceCard.findByIdAndUpdate(s._id, { sortOrder: s.sortOrder });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
