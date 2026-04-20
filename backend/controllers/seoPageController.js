const SeoPage = require("../models/SeoPage");
const { normalizeKeywords } = require("../utils/seoHelpers");

const createSeoPage = async (req, res, next) => {
  try {
    const { pageName, slug, metaTitle, metaDescription, metaKeywords, status } = req.body;

    if (!pageName || !slug || !metaTitle || !metaDescription) {
      res.status(400);
      throw new Error("pageName, slug, metaTitle and metaDescription are required");
    }

    const existingPage = await SeoPage.findOne({ slug: slug.trim().toLowerCase() });

    if (existingPage) {
      res.status(400);
      throw new Error("SEO page already exists with this slug");
    }

    const seoPage = await SeoPage.create({
      pageName,
      slug,
      metaTitle,
      metaDescription,
      metaKeywords: normalizeKeywords(metaKeywords),
      status,
    });

    return res.status(201).json({
      success: true,
      data: seoPage,
    });
  } catch (error) {
    next(error);
  }
};

const getSeoPages = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim();

    const filter = search
      ? {
          $or: [
            { pageName: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } },
            { metaTitle: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      SeoPage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      SeoPage.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSeoPageById = async (req, res, next) => {
  try {
    const seoPage = await SeoPage.findById(req.params.id);

    if (!seoPage) {
      res.status(404);
      throw new Error("SEO page not found");
    }

    return res.status(200).json({
      success: true,
      data: seoPage,
    });
  } catch (error) {
    next(error);
  }
};

const updateSeoPage = async (req, res, next) => {
  try {
    const { pageName, slug, metaTitle, metaDescription, metaKeywords, status } = req.body;
    const seoPage = await SeoPage.findById(req.params.id);

    if (!seoPage) {
      res.status(404);
      throw new Error("SEO page not found");
    }

    if (slug && slug.trim().toLowerCase() !== seoPage.slug) {
      const existingPage = await SeoPage.findOne({ slug: slug.trim().toLowerCase() });
      if (existingPage) {
        res.status(400);
        throw new Error("SEO page already exists with this slug");
      }
    }

    seoPage.pageName = pageName || seoPage.pageName;
    seoPage.slug = slug || seoPage.slug;
    seoPage.metaTitle = metaTitle || seoPage.metaTitle;
    seoPage.metaDescription = metaDescription || seoPage.metaDescription;
    seoPage.status = status || seoPage.status;

    if (metaKeywords !== undefined) {
      seoPage.metaKeywords = normalizeKeywords(metaKeywords);
    }

    const updatedSeoPage = await seoPage.save();

    return res.status(200).json({
      success: true,
      data: updatedSeoPage,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSeoPage = async (req, res, next) => {
  try {
    const seoPage = await SeoPage.findById(req.params.id);

    if (!seoPage) {
      res.status(404);
      throw new Error("SEO page not found");
    }

    await seoPage.deleteOne();

    return res.status(200).json({
      success: true,
      message: "SEO page deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleSeoPageStatus = async (req, res, next) => {
  try {
    const seoPage = await SeoPage.findById(req.params.id);

    if (!seoPage) {
      res.status(404);
      throw new Error("SEO page not found");
    }

    seoPage.status = seoPage.status === "active" ? "inactive" : "active";
    await seoPage.save();

    return res.status(200).json({
      success: true,
      data: seoPage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSeoPage,
  getSeoPages,
  getSeoPageById,
  updateSeoPage,
  deleteSeoPage,
  toggleSeoPageStatus,
};
