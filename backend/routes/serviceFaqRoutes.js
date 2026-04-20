const express = require("express");
const {
  createServiceFaq,
  getServiceFaqs,
  updateServiceFaq,
  deleteServiceFaq,
  toggleServiceFaqStatus,
} = require("../controllers/serviceFaqController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(createServiceFaq).get(getServiceFaqs);
router.put("/:id", updateServiceFaq);
router.delete("/:id", deleteServiceFaq);
router.patch("/:id/toggle-status", toggleServiceFaqStatus);

module.exports = router;
