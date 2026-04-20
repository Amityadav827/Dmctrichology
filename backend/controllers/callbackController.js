const Callback = require("../models/Callback");
const { buildDateFilter, isValidMobile, sanitizeText, toCsv } = require("../utils/leadHelpers");

const createCallback = async (req, res, next) => {
  try {
    const name = sanitizeText(req.body.name);
    const mobile = sanitizeText(req.body.mobile);

    if (!name || !mobile) {
      res.status(400);
      throw new Error("name and mobile are required");
    }

    if (!isValidMobile(mobile)) {
      res.status(400);
      throw new Error("Valid mobile number is required");
    }

    const callback = await Callback.create({
      name,
      mobile,
      status: "new",
    });

    return res.status(201).json({
      success: true,
      data: callback,
    });
  } catch (error) {
    next(error);
  }
};

const getCallbacks = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = sanitizeText(req.query.search || "");
    const status = sanitizeText(req.query.status || "").toLowerCase();
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const sortBy = ["name", "mobile", "status", "createdAt"].includes(req.query.sortBy)
      ? req.query.sortBy
      : "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    Object.assign(filter, buildDateFilter(startDate, endDate) || {});

    const [items, total] = await Promise.all([
      Callback.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit),
      Callback.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: items.length,
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

const updateCallbackStatus = async (req, res, next) => {
  try {
    const callback = await Callback.findById(req.params.id);

    if (!callback) {
      res.status(404);
      throw new Error("Callback lead not found");
    }

    callback.status = req.body.status || callback.status;
    await callback.save();

    return res.status(200).json({
      success: true,
      data: callback,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCallback = async (req, res, next) => {
  try {
    const callback = await Callback.findById(req.params.id);

    if (!callback) {
      res.status(404);
      throw new Error("Callback lead not found");
    }

    await callback.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Callback lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const exportCallbacksCsv = async (req, res, next) => {
  try {
    const items = await Callback.find().sort({ createdAt: -1 });
    const csv = toCsv(
      [
        { key: "name", label: "Name" },
        { key: "mobile", label: "Mobile" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Created At" },
      ],
      items.map((item) => ({
        name: item.name,
        mobile: item.mobile,
        status: item.status,
        createdAt: item.createdAt.toISOString(),
      }))
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=callback-leads.csv");
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCallback,
  getCallbacks,
  updateCallbackStatus,
  deleteCallback,
  exportCallbacksCsv,
};
