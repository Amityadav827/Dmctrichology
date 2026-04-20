const User = require("../models/User");
const Blog = require("../models/Blog");
const Service = require("../models/Service");
const Contact = require("../models/Contact");
const Callback = require("../models/Callback");
const Appointment = require("../models/Appointment");

const getDashboardStats = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalBlogs,
      totalServices,
      totalContacts,
      totalCallbacks,
      totalAppointments,
      todayContacts,
      todayCallbacks,
      todayAppointments,
      convertedCallbacks,
      completedAppointments,
      recentUsers,
    ] =
      await Promise.all([
        User.countDocuments(),
        Blog.countDocuments(),
        Service.countDocuments(),
        Contact.countDocuments(),
        Callback.countDocuments(),
        Appointment.countDocuments(),
        Contact.countDocuments({ createdAt: { $gte: startOfToday } }),
        Callback.countDocuments({ createdAt: { $gte: startOfToday } }),
        Appointment.countDocuments({ createdAt: { $gte: startOfToday } }),
        Callback.countDocuments({ status: "converted" }),
        Appointment.countDocuments({ status: "completed" }),
        User.find().sort({ createdAt: -1 }).limit(5).select("-password"),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBlogs,
        totalServices,
        totalContacts,
        totalCallbacks,
        totalAppointments,
        totalLeads: totalContacts + totalCallbacks + totalAppointments,
        todaysLeads: todayContacts + todayCallbacks + todayAppointments,
        convertedLeads: convertedCallbacks + completedAppointments,
        todaysAppointments: todayAppointments,
        completedAppointments,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
