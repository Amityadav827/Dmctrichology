const SecondCategory = require("../models/SecondCategory");
const ServiceCategory = require("../models/ServiceCategory");
const slugify = require("../utils/slugify");

const createSecondCategory = async (req, res, next) => {
  try {
    const { categoryId, name, slug, order, status } = req.body;

    if (!categoryId || !name) {
      res.status(400);
      throw new Error("categoryId and name are required");
    }

    const category = await ServiceCategory.findById(categoryId);
    if (!category) {
      res.status(404);
      throw new Error("Parent category not found");
    }

    const normalizedSlug = slugify(slug || name);
    const exists = await SecondCategory.findOne({
      categoryId,
      slug: normalizedSlug,
    });

    if (exists) {
      res.status(400);
      throw new Error("Second category slug already exists in this category");
    }

    const secondCategory = await SecondCategory.create({
      categoryId,
      name,
      slug: normalizedSlug,
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      status: status || "active",
    });

    const populated = await secondCategory.populate("categoryId", "name slug status");

    return res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getSecondCategories = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }

    const items = await SecondCategory.find(filter)
      .populate("categoryId", "name slug status")
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

const updateSecondCategory = async (req, res, next) => {
  try {
    const { categoryId, name, slug, order, status } = req.body;
    const secondCategory = await SecondCategory.findById(req.params.id);

    if (!secondCategory) {
      res.status(404);
      throw new Error("Second category not found");
    }

    const nextCategoryId = categoryId || secondCategory.categoryId.toString();
    const nextName = name || secondCategory.name;
    const nextSlug = slugify(slug || nextName);

    const parentCategory = await ServiceCategory.findById(nextCategoryId);
    if (!parentCategory) {
      res.status(404);
      throw new Error("Parent category not found");
    }

    const exists = await SecondCategory.findOne({
      _id: { $ne: secondCategory._id },
      categoryId: nextCategoryId,
      slug: nextSlug,
    });

    if (exists) {
      res.status(400);
      throw new Error("Second category slug already exists in this category");
    }

    secondCategory.categoryId = nextCategoryId;
    secondCategory.name = nextName;
    secondCategory.slug = nextSlug;
    secondCategory.order = Number.isFinite(Number(order)) ? Number(order) : secondCategory.order;
    secondCategory.status = status || secondCategory.status;

    await secondCategory.save();
    await secondCategory.populate("categoryId", "name slug status");

    return res.status(200).json({
      success: true,
      data: secondCategory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSecondCategory = async (req, res, next) => {
  try {
    const secondCategory = await SecondCategory.findById(req.params.id);

    if (!secondCategory) {
      res.status(404);
      throw new Error("Second category not found");
    }

    await secondCategory.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Second category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleSecondCategoryStatus = async (req, res, next) => {
  try {
    const secondCategory = await SecondCategory.findById(req.params.id).populate(
      "categoryId",
      "name slug status"
    );

    if (!secondCategory) {
      res.status(404);
      throw new Error("Second category not found");
    }

    secondCategory.status = secondCategory.status === "active" ? "inactive" : "active";
    await secondCategory.save();

    return res.status(200).json({
      success: true,
      data: secondCategory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSecondCategory,
  getSecondCategories,
  updateSecondCategory,
  deleteSecondCategory,
  toggleSecondCategoryStatus,
};
