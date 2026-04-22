const Testimonial = require("../models/Testimonial");

const createTestimonial = async (req, res, next) => {
  try {
    const { source, name, message, rating } = req.body;

    if (!source || !name || !message || !rating) {
      res.status(400);
      throw new Error("source, name, message and rating are required");
    }

    const testimonial = await Testimonial.create(req.body);

    return res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

const getTestimonials = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();
    const source = String(req.query.source || "").trim().toLowerCase();
    const status = String(req.query.status || "").trim();
    const rating = parseInt(req.query.rating, 10);

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { serviceName: { $regex: search, $options: "i" } },
      ];
    }

    if (source) {
      filter.source = source;
    }

    if (status) {
      filter.status = status;
    }

    if (rating && rating >= 1 && rating <= 5) {
      filter.rating = rating;
    }

    const [testimonials, total] = await Promise.all([
      Testimonial.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Testimonial.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
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

const getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      res.status(404);
      throw new Error("Testimonial not found");
    }

    return res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      res.status(404);
      throw new Error("Testimonial not found");
    }

    // Update fields
    const fieldsToUpdate = [
      "showType",
      "serviceName",
      "source",
      "name",
      "shortName",
      "designation",
      "message",
      "rating",
      "status",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        testimonial[field] = req.body[field];
      }
    });

    await testimonial.save();

    return res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      res.status(404);
      throw new Error("Testimonial not found");
    }

    await testimonial.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleTestimonialStatus = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      res.status(404);
      throw new Error("Testimonial not found");
    }

    testimonial.status = testimonial.status === "active" ? "inactive" : "active";
    await testimonial.save();

    return res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTestimonial,
  getTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
};
