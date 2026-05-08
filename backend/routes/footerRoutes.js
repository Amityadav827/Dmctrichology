const express = require('express');
const router = express.Router();
const { getFooter, updateFooter } = require('../controllers/footerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getFooter);
router.put('/', protect, updateFooter);

module.exports = router;
