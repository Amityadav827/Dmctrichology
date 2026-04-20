const express = require("express");
const {
  createSecondCategory,
  getSecondCategories,
  updateSecondCategory,
  deleteSecondCategory,
  toggleSecondCategoryStatus,
} = require("../controllers/secondCategoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(createSecondCategory).get(getSecondCategories);
router.put("/:id", updateSecondCategory);
router.delete("/:id", deleteSecondCategory);
router.patch("/:id/toggle-status", toggleSecondCategoryStatus);

module.exports = router;
