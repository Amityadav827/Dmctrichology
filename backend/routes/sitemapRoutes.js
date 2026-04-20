const express = require("express");
const {
  addSitemapEntry,
  getSitemapEntries,
  deleteSitemapEntry,
  generateSitemapXml,
} = require("../controllers/sitemapController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/xml", generateSitemapXml);
router.use(protect, adminOnly);
router.route("/").post(addSitemapEntry).get(getSitemapEntries);
router.delete("/:id", deleteSitemapEntry);

module.exports = router;
