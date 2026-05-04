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
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(upload.single("thumbnail"), createVideo).get(getVideos);
router.route("/:id").put(upload.single("thumbnail"), updateVideo).delete(deleteVideo);

router.patch("/status/:id", toggleVideoStatus);
router.patch("/order/:id", updateVideoOrder);

module.exports = router;
