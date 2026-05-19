const express = require("express");
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  bulkDeleteAppointments,
  exportAppointmentsCsv,
} = require("../controllers/appointmentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { publicFormRateLimit } = require("../middleware/publicRateLimitMiddleware");

const router = express.Router();

router.post("/", publicFormRateLimit, createAppointment);
router.use(protect, adminOnly);
router.get("/", getAppointments);
router.get("/export", exportAppointmentsCsv);
router.post("/bulk-delete", bulkDeleteAppointments);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;
