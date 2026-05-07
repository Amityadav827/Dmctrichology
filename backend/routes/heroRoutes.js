const express = require("express");
const router = express.Router();
const {
  getHero,
  createHero,
  updateHero,
  deleteHero,
} = require("../controllers/heroController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.route("/")
  .get(getHero)
  .post(protect, upload.single("backgroundImage"), createHero);

router.route("/:id")
  .put(protect, upload.single("backgroundImage"), updateHero)
  .delete(protect, deleteHero);

module.exports = router;
