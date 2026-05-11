const express = require("express");
const router = express.Router();
const { getDetailsPage, updateDetailsPage } = require("../controllers/detailsPageController");

router.get("/", getDetailsPage);
router.put("/", updateDetailsPage);

module.exports = router;
