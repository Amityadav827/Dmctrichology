const DetailsPage = require("../models/DetailsPage");

// GET — return entire details page data
exports.getDetailsPage = async (req, res) => {
  try {
    let data = await DetailsPage.findOne();
    if (!data) {
      data = await DetailsPage.create({});
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT — update entire details page data
exports.updateDetailsPage = async (req, res) => {
  try {
    let data = await DetailsPage.findOne();
    if (!data) {
      data = await DetailsPage.create(req.body);
    } else {
      // Deep merge: only update sent fields
      if (req.body.banner) Object.assign(data.banner, req.body.banner);
      if (req.body.intro) {
        Object.assign(data.intro, req.body.intro);
        if (req.body.intro.galleryImages !== undefined) {
          data.intro.galleryImages = req.body.intro.galleryImages;
          data.markModified("intro.galleryImages");
        }
        if (req.body.intro.bulletPoints !== undefined) {
          data.intro.bulletPoints = req.body.intro.bulletPoints;
          data.markModified("intro.bulletPoints");
        }
      }
      if (req.body.process) {
        Object.assign(data.process, req.body.process);
        if (req.body.process.processSteps !== undefined) {
          data.process.processSteps = req.body.process.processSteps;
          data.markModified("process.processSteps");
        }
      }
      await data.save();
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
