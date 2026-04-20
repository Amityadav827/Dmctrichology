const Operation = require("../models/Operation");

const createOperation = async (req, res, next) => {
  try {
    const { name, url, order, status } = req.body;

    if (!name || !url) {
      res.status(400);
      throw new Error("name and url are required");
    }

    const operation = await Operation.create({
      name,
      url,
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      status: status || "active",
    });

    return res.status(201).json({
      success: true,
      data: operation,
    });
  } catch (error) {
    next(error);
  }
};

const getOperations = async (req, res, next) => {
  try {
    const operations = await Operation.find().sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: operations.length,
      data: operations,
    });
  } catch (error) {
    next(error);
  }
};

const updateOperation = async (req, res, next) => {
  try {
    const { name, url, order, status } = req.body;
    const operation = await Operation.findById(req.params.id);

    if (!operation) {
      res.status(404);
      throw new Error("Operation not found");
    }

    operation.name = name || operation.name;
    operation.url = url || operation.url;
    operation.order = Number.isFinite(Number(order)) ? Number(order) : operation.order;
    operation.status = status || operation.status;

    await operation.save();

    return res.status(200).json({
      success: true,
      data: operation,
    });
  } catch (error) {
    next(error);
  }
};

const deleteOperation = async (req, res, next) => {
  try {
    const operation = await Operation.findById(req.params.id);

    if (!operation) {
      res.status(404);
      throw new Error("Operation not found");
    }

    await operation.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Operation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleOperationStatus = async (req, res, next) => {
  try {
    const operation = await Operation.findById(req.params.id);

    if (!operation) {
      res.status(404);
      throw new Error("Operation not found");
    }

    operation.status = operation.status === "active" ? "inactive" : "active";
    await operation.save();

    return res.status(200).json({
      success: true,
      data: operation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOperation,
  getOperations,
  updateOperation,
  deleteOperation,
  toggleOperationStatus,
};
