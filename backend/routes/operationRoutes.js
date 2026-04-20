const express = require("express");
const {
  createOperation,
  getOperations,
  updateOperation,
  deleteOperation,
  toggleOperationStatus,
} = require("../controllers/operationController");
const { protect, adminOnly, checkPermission } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly, checkPermission("users"));

router.route("/").post(createOperation).get(getOperations);
router.put("/:id", updateOperation);
router.delete("/:id", deleteOperation);
router.patch("/:id/toggle-status", toggleOperationStatus);

module.exports = router;
