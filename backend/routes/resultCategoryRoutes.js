const express = require("express");
const {
  createResultCategory,
  getResultCategories,
  updateResultCategory,
  deleteResultCategory,
  toggleResultCategoryStatus,
  updateResultCategoryOrder,
} = require("../controllers/resultCategoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(createResultCategory).get(getResultCategories);
router.put("/:id", updateResultCategory);
router.delete("/:id", deleteResultCategory);
router.patch("/:id/toggle-status", toggleResultCategoryStatus);
router.patch("/:id/order", updateResultCategoryOrder);

module.exports = router;
