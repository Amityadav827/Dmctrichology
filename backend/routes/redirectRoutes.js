const express = require("express");
const {
  createRedirect,
  getRedirects,
  updateRedirect,
  deleteRedirect,
  toggleRedirectStatus,
} = require("../controllers/redirectController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(createRedirect).get(getRedirects);
router.route("/:id").put(updateRedirect).delete(deleteRedirect);
router.patch("/:id/toggle-status", toggleRedirectStatus);

module.exports = router;
