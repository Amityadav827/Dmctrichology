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

const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "videoFile", maxCount: 1 },
]);

router.route("/").post(uploadFields, createVideo).get(getVideos);
router.route("/:id").put(uploadFields, updateVideo).delete(deleteVideo);

router.patch("/status/:id", toggleVideoStatus);
router.patch("/order/:id", updateVideoOrder);

module.exports = router;
