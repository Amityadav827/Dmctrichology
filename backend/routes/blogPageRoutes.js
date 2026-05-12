const express = require("express");
const router = express.Router();
const { getBlogPage, updateBlogPage } = require("../controllers/blogPageController");

router.get("/", getBlogPage);
router.put("/", updateBlogPage);

module.exports = router;
