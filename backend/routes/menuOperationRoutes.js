const express = require("express");
const {
  assignOperationToMenu,
  getMenuOperations,
  updateMenuOperation,
  deleteMenuOperation,
} = require("../controllers/menuOperationController");
const { protect, adminOnly, checkPermission } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly, checkPermission("users"));

router.route("/").post(assignOperationToMenu).get(getMenuOperations);
router.put("/:id", updateMenuOperation);
router.delete("/:id", deleteMenuOperation);

module.exports = router;
