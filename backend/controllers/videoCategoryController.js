const VideoCategory = require("../models/VideoCategory");

const createVideoCategory = async (req, res, next) => {
  try {
    const { name, description, order, status } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Category name is required");
    }

    const category = await VideoCategory.create({
      name,
      description: description || "",
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const getVideoCategories = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      VideoCategory.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      VideoCategory.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateVideoCategory = async (req, res, next) => {
  try {
    const { name, description, order, status } = req.body;
    const category = await VideoCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Video category not found");
    }

    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    category.order = Number.isFinite(Number(order)) ? Number(order) : category.order;
    category.status = status || category.status;

    await category.save();

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVideoCategory = async (req, res, next) => {
  try {
    const category = await VideoCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Video category not found");
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Video category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleVideoCategoryStatus = async (req, res, next) => {
  try {
    const category = await VideoCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Video category not found");
    }

    category.status = category.status === "active" ? "inactive" : "active";
    await category.save();

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const updateVideoCategoryOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const category = await VideoCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Video category not found");
    }

    if (!Number.isFinite(Number(order))) {
      res.status(400);
      throw new Error("Valid order is required");
    }

    category.order = Number(order);
    await category.save();

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVideoCategory,
  getVideoCategories,
  updateVideoCategory,
  deleteVideoCategory,
  toggleVideoCategoryStatus,
  updateVideoCategoryOrder,
};
