const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

const uploadFields = upload.fields([
  { name: "blogImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);

router.route("/").post(uploadFields, createBlog).get(getBlogs);
router.route("/:id").get(getBlogById).put(uploadFields, updateBlog).delete(deleteBlog);

module.exports = router;
