const express = require("express");
const {
  createVideo,
  getVideos,
  updateVideo,
  deleteVideo,
  toggleVideoStatus,
  updateVideoOrder,
} = require("../controllers/videoController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/cloudinaryUpload");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(upload.single("thumbnail"), createVideo).get(getVideos);
router.put("/:id", upload.single("thumbnail"), updateVideo);
router.delete("/:id", deleteVideo);
router.patch("/:id/toggle-status", toggleVideoStatus);
router.patch("/:id/order", updateVideoOrder);

module.exports = router;
