const express = require("express");
const {
  getRobotsContent,
  updateRobotsContent,
} = require("../controllers/robotsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").get(getRobotsContent).put(updateRobotsContent);

module.exports = router;
