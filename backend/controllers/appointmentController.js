const Appointment = require("../models/Appointment");

const createAppointment = async (req, res, next) => {
  try {
    const { name, email, mobile, service, appointmentDate, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your name." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your email address." });
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your mobile number." });
    }
    if (!/^\d{10}$/.test(mobile.trim().replace(/\s+/g, ''))) {
      return res.status(400).json({ success: false, message: "Please enter a valid 10-digit mobile number." });
    }
    if (!service || !service.trim()) {
      return res.status(400).json({ success: false, message: "Please select a type of service enquiry." });
    }
    if (!appointmentDate) {
      return res.status(400).json({ success: false, message: "Please select an appointment date and time." });
    }

    // Check for duplicate submissions in the last 2 minutes (prevent spam)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const existing = await Appointment.findOne({
      mobile: mobile.trim(),
      createdAt: { $gte: twoMinutesAgo }
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a request. Please wait a moment."
      });
    }

    const appointment = await Appointment.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim().replace(/\s+/g, ''),
      service: service.trim(),
      appointmentDate: new Date(appointmentDate),
      message: message ? message.trim() : "",
      status: "new"
    });

    return res.status(201).json({
      success: true,
      data: {
        ...appointment.toJSON(),
        _id: appointment._id,
        appointmentDate: appointment.appointmentDate
      }
    });
  } catch (error) {
    console.error("Error in createAppointment:", error);
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // 1. Live search filter
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex }
      ];
    }

    // 2. Status filter
    if (req.query.status) {
      filter.status = req.query.status.trim();
    }

    // 3. Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        const end = `${req.query.endDate}T23:59:59.999Z`;
        filter.createdAt.$lte = new Date(end);
      }
    }

    const total = await Appointment.countDocuments(filter);
    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedData = appointments.map(item => ({
      ...item.toJSON(),
      appointmentDate: item.appointmentDate,
      _id: item._id
    }));

    return res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in getAppointments:", error);
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment request not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...appointment.toJSON(),
        _id: appointment._id,
        appointmentDate: appointment.appointmentDate
      }
    });
  } catch (error) {
    console.error("Error in getAppointmentById:", error);
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment request not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...appointment.toJSON(),
        _id: appointment._id,
        appointmentDate: appointment.appointmentDate
      }
    });
  } catch (error) {
    console.error("Error in updateAppointment:", error);
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment request not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteAppointment:", error);
    next(error);
  }
};

const bulkDeleteAppointments = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a list of appointment IDs to delete"
      });
    }

    await Appointment.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      success: true,
      message: "Selected appointment requests deleted successfully"
    });
  } catch (error) {
    console.error("Error in bulkDeleteAppointments:", error);
    next(error);
  }
};

const exportAppointmentsCsv = async (req, res, next) => {
  try {
    const filter = {};

    // Apply exact same search / status / date range filters on export
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex }
      ];
    }
    if (req.query.status) {
      filter.status = req.query.status.trim();
    }
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        const end = `${req.query.endDate}T23:59:59.999Z`;
        filter.createdAt.$lte = new Date(end);
      }
    }

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });

    let csv = "ID,Name,Email,Mobile,Service,AppointmentDate,Status,Notes,CreatedAt\n";
    appointments.forEach(row => {
      const idStr = row._id.toString();
      const nameStr = row.name.replace(/"/g, '""');
      const emailStr = row.email.replace(/"/g, '""');
      const serviceStr = row.service.replace(/"/g, '""');
      const notesStr = (row.notes || "").replace(/"/g, '""');
      
      const apptDateStr = row.appointmentDate ? row.appointmentDate.toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      const createdStr = row.createdAt ? row.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      
      csv += `"${idStr}","${nameStr}","${emailStr}","${row.mobile}","${serviceStr}","${apptDateStr}","${row.status}","${notesStr}","${createdStr}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=appointments.csv");
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error in exportAppointmentsCsv:", error);
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  bulkDeleteAppointments,
  exportAppointmentsCsv,
};
