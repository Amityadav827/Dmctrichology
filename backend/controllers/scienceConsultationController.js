const ScienceConsultationLead = require("../models/ScienceConsultationLead");

const createLead = async (req, res, next) => {
  try {
    const { name, email, mobile, service, appointmentDate, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your name." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your email address." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }
    if (!mobile || !mobile.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your mobile number." });
    }
    const trimmedMobile = mobile.trim().replace(/\s+/g, '');
    if (!/^\d{10}$/.test(trimmedMobile)) {
      return res.status(400).json({ success: false, message: "Please enter a valid 10-digit mobile number." });
    }
    if (!appointmentDate) {
      return res.status(400).json({ success: false, message: "Please select an appointment date." });
    }

    // Duplicate prevention (spam filter: duplicate mobile in last 2 minutes)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const existing = await ScienceConsultationLead.findOne({
      mobile: trimmedMobile,
      createdAt: { $gte: twoMinutesAgo }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a request. Please wait a moment."
      });
    }

    const lead = await ScienceConsultationLead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: trimmedMobile,
      service: service ? service.trim() : "Hair Restoration",
      appointmentDate: new Date(appointmentDate),
      message: message ? message.trim() : "",
      status: "new",
      notes: ""
    });

    return res.status(201).json({
      success: true,
      data: {
        ...lead.toObject(),
        _id: lead._id,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt
      }
    });
  } catch (error) {
    console.error("Error in createLead:", error);
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryObj = {};

    // 1. Live search filter
    if (req.query.search) {
      const searchVal = req.query.search.trim();
      const searchRegex = new RegExp(searchVal, 'i');
      queryObj.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
        { service: searchRegex }
      ];
    }

    // 2. Status filter
    if (req.query.status) {
      queryObj.status = req.query.status.trim();
    }

    // 3. Date range filter
    if (req.query.startDate || req.query.endDate) {
      queryObj.createdAt = {};
      if (req.query.startDate) {
        queryObj.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        queryObj.createdAt.$lte = new Date(`${req.query.endDate}T23:59:59.999Z`);
      }
    }

    // 4. Sorting logic
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const sortByField = sortBy === "appointmentDate" ? "appointmentDate" : "createdAt";
    const sortObj = {};
    sortObj[sortByField] = sortOrder === "asc" ? 1 : -1;

    // Get count and data
    const total = await ScienceConsultationLead.countDocuments(queryObj);
    const leads = await ScienceConsultationLead.find(queryObj)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const formattedData = leads.map(lead => ({
      ...lead.toObject(),
      _id: lead._id,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt
    }));

    return res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error in getLeads:", error);
    next(error);
  }
};

const getLeadById = async (req, res, next) => {
  try {
    const lead = await ScienceConsultationLead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Science lead not found" });
    }
    return res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error("Error in getLeadById:", error);
    next(error);
  }
};

const updateLeadStatus = async (req, res, next) => {
  try {
    const { status, notes, service } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (service) updates.service = service;

    const lead = await ScienceConsultationLead.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: "Science lead not found" });
    }

    return res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error("Error in updateLeadStatus:", error);
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const lead = await ScienceConsultationLead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Science lead not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Science lead deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteLead:", error);
    next(error);
  }
};

const bulkDeleteLeads = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a list of lead IDs to delete"
      });
    }

    await ScienceConsultationLead.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      success: true,
      message: "Selected Science leads deleted successfully"
    });
  } catch (error) {
    console.error("Error in bulkDeleteLeads:", error);
    next(error);
  }
};

const exportCsv = async (req, res, next) => {
  try {
    const queryObj = {};

    // Apply exact same filters as getLeads
    if (req.query.search) {
      const searchVal = req.query.search.trim();
      const searchRegex = new RegExp(searchVal, 'i');
      queryObj.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
        { service: searchRegex }
      ];
    }

    if (req.query.status) {
      queryObj.status = req.query.status.trim();
    }

    if (req.query.startDate || req.query.endDate) {
      queryObj.createdAt = {};
      if (req.query.startDate) {
        queryObj.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        queryObj.createdAt.$lte = new Date(`${req.query.endDate}T23:59:59.999Z`);
      }
    }

    const leads = await ScienceConsultationLead.find(queryObj).sort({ createdAt: -1 });

    let csv = "ID,Name,Email,Mobile,Service,AppointmentDate,Status,Notes,CreatedAt\n";
    leads.forEach(row => {
      const idStr = row._id.toString();
      const nameStr = row.name.replace(/"/g, '""');
      const emailStr = row.email.replace(/"/g, '""');
      const serviceStr = (row.service || "").replace(/"/g, '""');
      const notesStr = (row.notes || "").replace(/"/g, '""');
      
      const apptDateStr = row.appointmentDate ? new Date(row.appointmentDate).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      const createdStr = row.createdAt ? new Date(row.createdAt).toISOString().replace(/T/, ' ').replace(/\..+/, '') : '';
      
      csv += `"${idStr}","${nameStr}","${emailStr}","${row.mobile}","${serviceStr}","${apptDateStr}","${row.status}","${notesStr}","${createdStr}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=science-consultation-leads.csv");
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error in exportCsv:", error);
    next(error);
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
  bulkDeleteLeads,
  exportCsv
};
