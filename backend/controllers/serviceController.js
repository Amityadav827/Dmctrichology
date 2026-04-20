const Service = require("../models/Service");

const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);

    return res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

const getServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    await service.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
