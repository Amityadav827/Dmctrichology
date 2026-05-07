const Section = require('../models/Section');

exports.getSectionData = async (req, res) => {
  try {
    const { sectionId } = req.params;
    let section = await Section.findOne({ sectionId });
    
    // If not found, return empty data or handle via specific seeders
    if (!section) {
      return res.json({ success: true, data: {}, isNew: true });
    }
    
    res.json({ success: true, data: section.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSectionData = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const section = await Section.findOneAndUpdate(
      { sectionId },
      { 
        sectionId, 
        name: sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/-/g, ' '),
        data: req.body 
      },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: section.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllSections = async (req, res) => {
  try {
    const sections = await Section.find();
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
