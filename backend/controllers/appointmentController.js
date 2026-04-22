const Appointment = require("../models/Appointment");
const {
  buildDateFilter,
  isValidEmail,
  isValidMobile,
  sanitizeText,
  toCsv,
} = require("../utils/leadHelpers");

const createAppointment = async (req, res, next) => {
  try {
    const name = sanitizeText(req.body.name);
    const email = sanitizeText(req.body.email).toLowerCase();
    const mobile = sanitizeText(req.body.mobile);
    const service = sanitizeText(req.body.service);
    const appointmentDate = req.body.appointmentDate;
    const message = sanitizeText(req.body.message || "");

    if (!name || !email || !mobile || !service || !appointmentDate) {
      res.status(400);
      throw new Error("name, email, mobile, service and appointmentDate are required");
    }

    if (!isValidEmail(email)) {
      res.status(400);
      throw new Error("Valid email is required");
    }

    if (!isValidMobile(mobile)) {
      res.status(400);
      throw new Error("Valid mobile number is required");
    }

    const appointment = await Appointment.create({
      name,
      email,
      mobile,
      service,
      appointmentDate,
      message,
      status: "new",
    });

    return res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = sanitizeText(req.query.search || "");
    const status = sanitizeText(req.query.status || "").toLowerCase();
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const quickFilter = sanitizeText(req.query.quickFilter || "").toLowerCase();
    const sortBy = ["name", "email", "mobile", "service", "appointmentDate", "status", "createdAt"].includes(
      req.query.sortBy
    )
      ? req.query.sortBy
      : "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { service: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    Object.assign(filter, buildDateFilter(startDate, endDate) || {});

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    if (quickFilter === "today") {
      filter.appointmentDate = {
        $gte: startOfToday,
        $lte: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000 - 1),
      };
    }

    if (quickFilter === "week") {
      const day = now.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() + diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      filter.appointmentDate = {
        $gte: startOfWeek,
        $lte: endOfWeek,
      };
    }

    if (quickFilter === "pending") {
      filter.status = "new";
    }

    const [items, total] = await Promise.all([
      Appointment.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit),
      Appointment.countDocuments(filter),
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

const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error("Appointment lead not found");
    }

    appointment.status = req.body.status || appointment.status;
    appointment.notes = typeof req.body.notes === "string" ? sanitizeText(req.body.notes) : appointment.notes;
    appointment.service = req.body.service ? sanitizeText(req.body.service) : appointment.service;
    appointment.appointmentDate = req.body.appointmentDate || appointment.appointmentDate;
    await appointment.save();

    return res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error("Appointment lead not found");
    }

    await appointment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const exportAppointmentsCsv = async (req, res, next) => {
  try {
    const items = await Appointment.find().sort({ createdAt: -1 });
    const csv = toCsv(
      [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "mobile", label: "Mobile" },
        { key: "service", label: "Service" },
        { key: "appointmentDate", label: "Appointment Date" },
        { key: "message", label: "Message" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Created At" },
      ],
      items.map((item) => ({
        name: item.name,
        email: item.email,
        mobile: item.mobile,
        service: item.service,
        appointmentDate: item.appointmentDate.toISOString(),
        message: item.message,
        status: item.status,
        createdAt: item.createdAt.toISOString(),
      }))
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=appointment-leads.csv");
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  exportAppointmentsCsv,
};
