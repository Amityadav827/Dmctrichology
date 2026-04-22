const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, adminOnly, getAdminProfile);

module.exports = router;
