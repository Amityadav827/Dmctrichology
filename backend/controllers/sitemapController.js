const Sitemap = require("../models/Sitemap");
const { buildSitemapXml } = require("../utils/seoHelpers");

const addSitemapEntry = async (req, res, next) => {
  try {
    const { url, lastModified, priority, changeFreq } = req.body;

    if (!url) {
      res.status(400);
      throw new Error("url is required");
    }

    const existingEntry = await Sitemap.findOne({ url });

    if (existingEntry) {
      res.status(400);
      throw new Error("Sitemap entry already exists for this URL");
    }

    const sitemapEntry = await Sitemap.create({
      url,
      lastModified,
      priority,
      changeFreq,
    });

    return res.status(201).json({
      success: true,
      data: sitemapEntry,
    });
  } catch (error) {
    next(error);
  }
};

const getSitemapEntries = async (req, res, next) => {
  try {
    const entries = await Sitemap.find().sort({ lastModified: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSitemapEntry = async (req, res, next) => {
  try {
    const entry = await Sitemap.findById(req.params.id);

    if (!entry) {
      res.status(404);
      throw new Error("Sitemap entry not found");
    }

    await entry.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Sitemap entry deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const generateSitemapXml = async (req, res, next) => {
  try {
    const entries = await Sitemap.find().sort({ lastModified: -1, createdAt: -1 });
    const xml = buildSitemapXml(entries);

    return res
      .status(200)
      .set("Content-Type", "application/xml")
      .send(xml);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSitemapEntry,
  getSitemapEntries,
  deleteSitemapEntry,
  generateSitemapXml,
};
