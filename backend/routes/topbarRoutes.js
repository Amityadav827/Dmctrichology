const express = require('express');
const { getTopBar, updateTopBar } = require('../controllers/topbarController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getTopBar)
  .put(protect, updateTopBar);

module.exports = router;
