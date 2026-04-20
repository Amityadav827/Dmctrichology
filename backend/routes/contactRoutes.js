const express = require("express");
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  exportContactsCsv,
} = require("../controllers/contactController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { publicFormRateLimit } = require("../middleware/publicRateLimitMiddleware");

const router = express.Router();

router.post("/", publicFormRateLimit, createContact);
router.use(protect, adminOnly);
router.get("/", getContacts);
router.get("/export/csv", exportContactsCsv);
router.route("/:id").get(getContactById).put(updateContact).delete(deleteContact);

module.exports = router;
