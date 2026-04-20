const ResultCategory = require("../models/ResultCategory");

const createResultCategory = async (req, res, next) => {
  try {
    const { name, description, order, status } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Category name is required");
    }

    const category = await ResultCategory.create({
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

const getResultCategories = async (req, res, next) => {
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
      ResultCategory.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      ResultCategory.countDocuments(filter),
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

const updateResultCategory = async (req, res, next) => {
  try {
    const { name, description, order, status } = req.body;
    const category = await ResultCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Result category not found");
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

const deleteResultCategory = async (req, res, next) => {
  try {
    const category = await ResultCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Result category not found");
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Result category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleResultCategoryStatus = async (req, res, next) => {
  try {
    const category = await ResultCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Result category not found");
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

const updateResultCategoryOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const category = await ResultCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Result category not found");
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
  createResultCategory,
  getResultCategories,
  updateResultCategory,
  deleteResultCategory,
  toggleResultCategoryStatus,
  updateResultCategoryOrder,
};
