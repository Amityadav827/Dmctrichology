const express = require("express");
const { 
  createComment, 
  getCommentsBySlug,
  getAllCommentsAdmin,
  updateCommentStatusAdmin,
  deleteCommentAdmin
} = require("../controllers/commentController");

const router = express.Router();

// Public routes
router.get("/:slug", getCommentsBySlug);
router.post("/", createComment);

// Admin routes
router.get("/admin/all", getAllCommentsAdmin);
router.patch("/admin/:id", updateCommentStatusAdmin);
router.delete("/admin/:id", deleteCommentAdmin);

module.exports = router;
