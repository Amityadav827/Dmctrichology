const express = require("express");
const router = express.Router();
const {
  createPage,
  getPages,
  getPageById,
  updatePage,
  deletePage,
  getPageBySlug,
} = require("../controllers/pageController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/slug/:slug", getPageBySlug);

router.use(protect, adminOnly);

router.route("/").get(getPages).post(createPage);
router.route("/:id").get(getPageById).put(updatePage).delete(deletePage);

module.exports = router;
