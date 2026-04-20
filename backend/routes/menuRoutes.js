const express = require("express");
const {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
  toggleMenuStatus,
  updateMenuOrder,
} = require("../controllers/menuController");
const { protect, adminOnly, checkPermission } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly, checkPermission("users"));

router.route("/").post(createMenu).get(getMenus);
router.put("/:id", updateMenu);
router.delete("/:id", deleteMenu);
router.patch("/:id/toggle-status", toggleMenuStatus);
router.patch("/:id/order", updateMenuOrder);

module.exports = router;
