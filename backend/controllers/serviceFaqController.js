const ServiceFaq = require("../models/ServiceFaq");
const SecondCategory = require("../models/SecondCategory");

const createServiceFaq = async (req, res, next) => {
  try {
    const { serviceId, question, answer, order, status } = req.body;

    if (!serviceId || !question || !answer) {
      res.status(400);
      throw new Error("serviceId, question and answer are required");
    }

    const service = await SecondCategory.findById(serviceId);
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    const faq = await ServiceFaq.create({
      serviceId,
      question,
      answer,
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
      status: status || "active",
    });

    const populated = await faq.populate({
      path: "serviceId",
      populate: {
        path: "categoryId",
        select: "name slug",
      },
      select: "name slug categoryId",
    });

    return res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getServiceFaqs = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.serviceId) {
      filter.serviceId = req.query.serviceId;
    }

    const items = await ServiceFaq.find(filter)
      .populate({
        path: "serviceId",
        populate: {
          path: "categoryId",
          select: "name slug",
        },
        select: "name slug categoryId",
      })
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

const updateServiceFaq = async (req, res, next) => {
  try {
    const { serviceId, question, answer, order, status } = req.body;
    const faq = await ServiceFaq.findById(req.params.id);

    if (!faq) {
      res.status(404);
      throw new Error("FAQ not found");
    }

    if (serviceId) {
      const service = await SecondCategory.findById(serviceId);
      if (!service) {
        res.status(404);
        throw new Error("Service not found");
      }
      faq.serviceId = serviceId;
    }

    faq.question = question || faq.question;
    faq.answer = answer || faq.answer;
    faq.order = Number.isFinite(Number(order)) ? Number(order) : faq.order;
    faq.status = status || faq.status;

    await faq.save();
    await faq.populate({
      path: "serviceId",
      populate: {
        path: "categoryId",
        select: "name slug",
      },
      select: "name slug categoryId",
    });

    return res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

const deleteServiceFaq = async (req, res, next) => {
  try {
    const faq = await ServiceFaq.findById(req.params.id);

    if (!faq) {
      res.status(404);
      throw new Error("FAQ not found");
    }

    await faq.deleteOne();

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleServiceFaqStatus = async (req, res, next) => {
  try {
    const faq = await ServiceFaq.findById(req.params.id).populate({
      path: "serviceId",
      populate: {
        path: "categoryId",
        select: "name slug",
      },
      select: "name slug categoryId",
    });

    if (!faq) {
      res.status(404);
      throw new Error("FAQ not found");
    }

    faq.status = faq.status === "active" ? "inactive" : "active";
    await faq.save();

    return res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createServiceFaq,
  getServiceFaqs,
  updateServiceFaq,
  deleteServiceFaq,
  toggleServiceFaqStatus,
};
