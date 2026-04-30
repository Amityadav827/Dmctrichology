const express = require("express");
const {
  createGalleryItem,
  getGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryItemStatus,
} = require("../controllers/galleryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/galleryUploadMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(upload.array("images", 20), createGalleryItem).get(getGalleryItems);
router
  .route("/:id")
  .get(getGalleryItemById)
  .put(upload.array("images", 1), updateGalleryItem)
  .delete(deleteGalleryItem);
router.patch("/:id/toggle-status", toggleGalleryItemStatus);

module.exports = router;
