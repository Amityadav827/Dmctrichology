const express = require("express");
const {
  createSeoPage,
  getSeoPages,
  getSeoPageById,
  updateSeoPage,
  deleteSeoPage,
  toggleSeoPageStatus,
} = require("../controllers/seoPageController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(createSeoPage).get(getSeoPages);
router.route("/:id").get(getSeoPageById).put(updateSeoPage).delete(deleteSeoPage);
router.patch("/:id/toggle-status", toggleSeoPageStatus);

module.exports = router;
