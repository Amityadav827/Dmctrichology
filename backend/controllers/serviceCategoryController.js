const ServiceCategory = require("../models/ServiceCategory");
const slugify = require("../utils/slugify");

const createCategory = async (req, res, next) => {
  try {
    const { name, slug, order, status } = req.body;

    if (!name) {
      res.status(400);
      throw new Error("Category name is required");
    }

    const normalizedSlug = slugify(slug || name);
    const exists = await ServiceCategory.findOne({ slug: normalizedSlug });

    if (exists) {
      res.status(400);
      throw new Error("Category slug already exists");
    }

    const category = await ServiceCategory.create({
      name,
      slug: normalizedSlug,
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

const getCategories = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      ServiceCategory.find(filter).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit),
      ServiceCategory.countDocuments(filter),
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

const updateCategory = async (req, res, next) => {
  try {
    const { name, slug, order, status } = req.body;
    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    const nextSlug = slug ? slugify(slug) : name ? slugify(name) : category.slug;

    if (nextSlug !== category.slug) {
      const exists = await ServiceCategory.findOne({ slug: nextSlug });
      if (exists) {
        res.status(400);
        throw new Error("Category slug already exists");
      }
    }

    category.name = name || category.name;
    category.slug = nextSlug;
    category.order = Number.isFinite(Number(order)) ? Number(order) : category.order;
    category.status = status || category.status;

    const updatedCategory = await category.save();

    return res.status(200).json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleCategoryStatus = async (req, res, next) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Category not found");
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

const updateCategoryOrder = async (req, res, next) => {
  try {
    const { order } = req.body;
    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Category not found");
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
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  updateCategoryOrder,
};
