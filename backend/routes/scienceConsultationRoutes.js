const express = require("express");
const {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
  bulkDeleteLeads,
  exportCsv,
} = require("../controllers/scienceConsultationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { publicFormRateLimit } = require("../middleware/publicRateLimitMiddleware");

const router = express.Router();

router.post("/", publicFormRateLimit, createLead);

// All dashboard operations are protected and admin-only
router.use(protect, adminOnly);
router.get("/", getLeads);
router.get("/export", exportCsv);
router.post("/bulk-delete", bulkDeleteLeads);
router.get("/:id", getLeadById);
router.put("/:id", updateLeadStatus);
router.delete("/:id", deleteLead);

module.exports = router;
