const express = require("express");
const router = express.Router();
const { getServices, createService, updateService, deleteService, bulkUpdate } = require("../controllers/serviceCardController");

router.get("/", getServices);
router.post("/", createService);
router.put("/bulk-update", bulkUpdate);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;
