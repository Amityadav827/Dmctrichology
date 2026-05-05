const express = require("express");
const {
  createBlogCategory,
  getBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
  toggleBlogCategoryStatus,
} = require("../controllers/blogCategoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(createBlogCategory).get(getBlogCategories);
router.route("/:id").get(getBlogCategoryById).put(updateBlogCategory).delete(deleteBlogCategory);
router.patch("/status/:id", toggleBlogCategoryStatus);

module.exports = router;
