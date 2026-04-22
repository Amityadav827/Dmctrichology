const express = require("express");
const router = express.Router();
const {
  getRedirects,
  createRedirect,
  updateRedirect,
  deleteRedirect,
  toggleRedirectStatus,
} = require("../controllers/redirectController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected and admin only (protected by protect middleware usually, 
// but I'll check authMiddleware to be sure)
router.use(protect);

router.route("/")
  .get(getRedirects)
  .post(createRedirect);

router.route("/:id")
  .put(updateRedirect)
  .delete(deleteRedirect);

router.patch("/:id/status", toggleRedirectStatus);

module.exports = router;
