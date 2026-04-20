const express = require("express");
const {
  createCallback,
  getCallbacks,
  updateCallbackStatus,
  deleteCallback,
  exportCallbacksCsv,
} = require("../controllers/callbackController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { publicFormRateLimit } = require("../middleware/publicRateLimitMiddleware");

const router = express.Router();

router.post("/", publicFormRateLimit, createCallback);
router.use(protect, adminOnly);
router.get("/", getCallbacks);
router.get("/export/csv", exportCallbacksCsv);
router.patch("/:id/status", updateCallbackStatus);
router.delete("/:id", deleteCallback);

module.exports = router;
