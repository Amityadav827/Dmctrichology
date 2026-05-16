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

router.get("/", getBlogCategories);

router.use(protect, adminOnly);

router.post("/", createBlogCategory);
router.route("/:id").get(getBlogCategoryById).put(updateBlogCategory).delete(deleteBlogCategory);
router.patch("/status/:id", toggleBlogCategoryStatus);

module.exports = router;
