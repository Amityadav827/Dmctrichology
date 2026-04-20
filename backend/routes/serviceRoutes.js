const express = require("express");
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").post(createService).get(getServices);
router.route("/:id").get(getServiceById).put(updateService).delete(deleteService);

module.exports = router;
