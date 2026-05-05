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

// Support both video file and thumbnail image upload
const videoUploadFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]);

router.route("/")
  .post(videoUploadFields, createVideo)
  .get(getVideos);

router.route("/:id")
  .put(videoUploadFields, updateVideo)
  .delete(deleteVideo);

router.patch("/status/:id", toggleVideoStatus);
router.patch("/order/:id", updateVideoOrder);

module.exports = router;
