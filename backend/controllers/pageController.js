const Page = require("../models/Page");

const createPage = async (req, res, next) => {
  try {
    const pageData = { ...req.body };
    const page = await Page.create(pageData);

    return res.status(201).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

const getPages = async (req, res, next) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: pages.length,
      data: pages,
    });
  } catch (error) {
    next(error);
  }
};

const getPageById = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      res.status(404);
      throw new Error("Page not found");
    }

    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

const updatePage = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    const page = await Page.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!page) {
      res.status(404);
      throw new Error("Page not found");
    }

    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

const deletePage = async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      res.status(404);
      throw new Error("Page not found");
    }

    await page.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getPageBySlug = async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, status: "Published" });

    if (!page) {
      res.status(404);
      throw new Error("Page not found");
    }

    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPage,
  getPages,
  getPageById,
  updatePage,
  deletePage,
  getPageBySlug,
};
