const express = require("express");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  updateCategoryOrder,
} = require("../controllers/serviceCategoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(createCategory).get(getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.patch("/:id/toggle-status", toggleCategoryStatus);
router.patch("/:id/order", updateCategoryOrder);

module.exports = router;
