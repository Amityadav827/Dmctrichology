const Contact = require("../models/Contact");
const {
  buildDateFilter,
  isValidEmail,
  isValidMobile,
  sanitizeText,
  toCsv,
} = require("../utils/leadHelpers");

const createContact = async (req, res, next) => {
  try {
    const name = sanitizeText(req.body.name);
    const email = sanitizeText(req.body.email).toLowerCase();
    const mobile = sanitizeText(req.body.mobile);
    const message = sanitizeText(req.body.message);

    if (!name || !email || !mobile || !message) {
      res.status(400);
      throw new Error("name, email, mobile and message are required");
    }

    if (!isValidEmail(email)) {
      res.status(400);
      throw new Error("Valid email is required");
    }

    if (!isValidMobile(mobile)) {
      res.status(400);
      throw new Error("Valid mobile number is required");
    }

    const contact = await Contact.create({
      name,
      email,
      mobile,
      message,
      status: "new",
    });

    return res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const search = sanitizeText(req.query.search || "");
    const status = sanitizeText(req.query.status || "").toLowerCase();
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const sortBy = ["name", "email", "mobile", "status", "createdAt"].includes(req.query.sortBy)
      ? req.query.sortBy
      : "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    Object.assign(filter, buildDateFilter(startDate, endDate) || {});

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit),
      Contact.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
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

const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404);
      throw new Error("Contact message not found");
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404);
      throw new Error("Contact message not found");
    }

    contact.name = req.body.name ? sanitizeText(req.body.name) : contact.name;
    contact.email = req.body.email ? sanitizeText(req.body.email).toLowerCase() : contact.email;
    contact.mobile = req.body.mobile ? sanitizeText(req.body.mobile) : contact.mobile;
    contact.message = req.body.message ? sanitizeText(req.body.message) : contact.message;
    contact.status = req.body.status || contact.status;

    await contact.save();

    return res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      res.status(404);
      throw new Error("Contact message not found");
    }

    await contact.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const exportContactsCsv = async (req, res, next) => {
  try {
    const items = await Contact.find().sort({ createdAt: -1 });
    const csv = toCsv(
      [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "mobile", label: "Mobile" },
        { key: "message", label: "Message" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Created At" },
      ],
      items.map((item) => ({
        name: item.name,
        email: item.email,
        mobile: item.mobile,
        message: item.message,
        status: item.status,
        createdAt: item.createdAt.toISOString(),
      }))
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=contact-leads.csv");
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  exportContactsCsv,
};
