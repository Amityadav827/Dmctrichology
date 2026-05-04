const express = require("express");
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

const uploadFields = upload.fields([
  { name: "serviceImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);

router.use(protect, adminOnly);

router.route("/").post(uploadFields, createService).get(getServices);
router.route("/:id").get(getServiceById).put(uploadFields, updateService).delete(deleteService);

module.exports = router;
