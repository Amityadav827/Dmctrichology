const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(createBlog).get(getBlogs);
router.route("/:id").get(getBlogById).put(updateBlog).delete(deleteBlog);

module.exports = router;
