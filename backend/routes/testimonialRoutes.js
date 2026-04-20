const express = require("express");
const {
  createTestimonial,
  getTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
} = require("../controllers/testimonialController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(createTestimonial).get(getTestimonials);
router
  .route("/:id")
  .get(getTestimonialById)
  .put(updateTestimonial)
  .delete(deleteTestimonial);
router.patch("/:id/toggle-status", toggleTestimonialStatus);

module.exports = router;
