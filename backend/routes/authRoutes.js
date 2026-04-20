const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", protect, adminOnly, getAdminProfile);

module.exports = router;
