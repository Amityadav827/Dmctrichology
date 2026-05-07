const express = require('express');
const { getHeader, updateHeader } = require('../controllers/headerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getHeader)
  .put(protect, updateHeader);

module.exports = router;
