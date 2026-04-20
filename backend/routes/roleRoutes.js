const express = require("express");
const {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");
const { protect, adminOnly, checkPermission } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly, checkPermission("users"));

router.route("/").post(createRole).get(getRoles);
router.route("/:id").put(updateRole).delete(deleteRole);

module.exports = router;
