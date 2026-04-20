const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/userController");
const { protect, adminOnly, checkPermission } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly, checkPermission("users"));

router.route("/").post(createUser).get(getUsers);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
router.patch("/:id/toggle-status", toggleUserStatus);

module.exports = router;
