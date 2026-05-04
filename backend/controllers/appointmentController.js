const supabase = require("../config/supabase");

const createAppointment = async (req, res, next) => {
  try {
    const { name, email, mobile, service, appointmentDate, message } = req.body;

    if (!name || !email || !mobile || !service || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const supabaseData = {
      name,
      email,
      mobile,
      service,
      appointment_date: appointmentDate,
      message: message || "",
      status: "new",
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([supabaseData])
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, message: error.message });

    return res.status(201).json({
      success: true,
      data: {
        ...data,
        appointmentDate: data.appointment_date,
        _id: data.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { data, count, error } = await supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    if (error) return res.status(500).json({ success: false, message: error.message });

    const formattedData = data.map(item => ({
      ...item,
      appointmentDate: item.appointment_date,
      _id: item.id,
    }));

    return res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAppointmentById = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: "Appointment not found" });

    return res.status(200).json({
      success: true,
      data: {
        ...data,
        appointmentDate: data.appointment_date,
        _id: data.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAppointment = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ success: false, message: "Appointment not found" });

    return res.status(200).json({
      success: true,
      data: {
        ...data,
        appointmentDate: data.appointment_date,
        _id: data.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteAppointment = async (req, res, next) => {
  try {
    const { error } = await supabase.from('appointments').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ success: false, message: error.message });
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
    const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });

    let csv = "ID,Name,Email,Mobile,Service,Date,Status,Notes,CreatedAt\n";
    data.forEach(row => {
      csv += `${row.id},${row.name},${row.email},${row.mobile},${row.service},${row.appointment_date},${row.status},"${(row.notes || '').replace(/"/g, '""')}",${row.created_at}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=appointments.csv");
    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  exportAppointmentsCsv,
};
