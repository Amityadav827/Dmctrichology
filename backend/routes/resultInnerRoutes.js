const express = require("express");
const {
  createResultInner,
  getResultInners,
  updateResultInner,
  deleteResultInner,
  toggleResultInnerStatus,
  updateResultInnerOrder,
} = require("../controllers/resultInnerController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(upload.single("image"), createResultInner).get(getResultInners);
router.put("/:id", upload.single("image"), updateResultInner);
router.delete("/:id", deleteResultInner);
router.patch("/:id/toggle-status", toggleResultInnerStatus);
router.patch("/:id/order", updateResultInnerOrder);

module.exports = router;
