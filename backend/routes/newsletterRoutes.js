const express = require("express");
const router = express.Router();
const {
  subscribeNewsletter,
  getSubscribers,
  deleteSubscriber,
  bulkDeleteSubscribers,
  exportSubscribersCsv
} = require("../controllers/newsletterController");
const { protect, checkPermission } = require("../middleware/authMiddleware");

// Public
router.post("/subscribe", subscribeNewsletter);

// Protected admin dashboard endpoints
router.get("/", protect, checkPermission("users"), getSubscribers);
router.post("/bulk-delete", protect, checkPermission("users"), bulkDeleteSubscribers);
router.get("/export/csv", protect, checkPermission("users"), exportSubscribersCsv);
router.delete("/:id", protect, checkPermission("users"), deleteSubscriber);

module.exports = router;
