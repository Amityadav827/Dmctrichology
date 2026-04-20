const express = require("express");
const {
  createVideoCategory,
  getVideoCategories,
  updateVideoCategory,
  deleteVideoCategory,
  toggleVideoCategoryStatus,
  updateVideoCategoryOrder,
} = require("../controllers/videoCategoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(createVideoCategory).get(getVideoCategories);
router.put("/:id", updateVideoCategory);
router.delete("/:id", deleteVideoCategory);
router.patch("/:id/toggle-status", toggleVideoCategoryStatus);
router.patch("/:id/order", updateVideoCategoryOrder);

module.exports = router;
