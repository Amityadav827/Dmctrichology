const fs = require("fs");
const path = require("path");
const ResultInner = require("../models/ResultInner");
const ResultCategory = require("../models/ResultCategory");

const removeUploadedFile = (imagePath) => {
  if (!imagePath) {
    return;
  }

  const absolutePath = path.join(__dirname, "..", imagePath.replace(/^(https?:\/\/[^\/]+)?\//, ""));
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

const normalizeImagePath = (req, file) => {
  if (!file) {
    return "";
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${file.filename}`;
};

const createResultInner = async (req, res, next) => {
  try {
    const { categoryId, title, order, status } = req.body;

    if (!categoryId || !title) {
      if (req.file) {
        removeUploadedFile(`/uploads/${req.file.filename}`);
      }
      res.status(400);
      throw new Error("categoryId and title are required");
    }

    if (!req.file) {
      res.status(400);
      throw new Error("Image is required");
    }

    const category = await ResultCategory.findById(categoryId);
    if (!category) {
      removeUploadedFile(`/uploads/${req.file.filename}`);
      res.status(404);
      throw new Error("Result category not found");
    }

    const item = await ResultInner.create({
      categoryId,
      title,
      image: normalizeImagePath(req, req.file),
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      status: status || "active",
    });

    await item.populate("categoryId", "name description status");

    return res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const getResultInners = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }

    const items = await ResultInner.find(filter)
      .populate("categoryId", "name description status")
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

const updateResultInner = async (req, res, next) => {
  try {
    const { categoryId, title, order, status } = req.body;
    const item = await ResultInner.findById(req.params.id);

    if (!item) {
      if (req.file) {
        removeUploadedFile(`/uploads/${req.file.filename}`);
      }
      res.status(404);
      throw new Error("Result not found");
    }

    const nextCategoryId = categoryId || item.categoryId.toString();
    const category = await ResultCategory.findById(nextCategoryId);
    if (!category) {
      if (req.file) {
        removeUploadedFile(`/uploads/${req.file.filename}`);
      }
      res.status(404);
      throw new Error("Result category not found");
    }

    if (req.file) {
      removeUploadedFile(item.image);
      item.image = normalizeImagePath(req, req.file);
    }

    item.categoryId = nextCategoryId;
    item.title = title || item.title;
    item.order = Number.isFinite(Number(order)) ? Number(order) : item.order;
    item.status = status || item.status;

    await item.save();
    await item.populate("categoryId", "name description status");

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const deleteResultInner = async (req, res, next) => {
  try {
    const item = await ResultInner.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Result not found");
    }

    removeUploadedFile(item.image);
    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleResultInnerStatus = async (req, res, next) => {
  try {
    const item = await ResultInner.findById(req.params.id).populate(
      "categoryId",
      "name description status"
    );

    if (!item) {
      res.status(404);
      throw new Error("Result not found");
    }

    item.status = item.status === "active" ? "inactive" : "active";
    await item.save();

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

const updateResultInnerOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const item = await ResultInner.findById(req.params.id).populate(
      "categoryId",
      "name description status"
    );

    if (!item) {
      res.status(404);
      throw new Error("Result not found");
    }

    if (!Number.isFinite(Number(order))) {
      res.status(400);
      throw new Error("Valid order is required");
    }

    item.order = Number(order);
    await item.save();

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResultInner,
  getResultInners,
  updateResultInner,
  deleteResultInner,
  toggleResultInnerStatus,
  updateResultInnerOrder,
};
