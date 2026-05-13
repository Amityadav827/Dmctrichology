const express = require("express");
const { createComment, getCommentsBySlug } = require("../controllers/commentController");

const router = express.Router();

router.get("/:slug", getCommentsBySlug);
router.post("/", createComment);

module.exports = router;
