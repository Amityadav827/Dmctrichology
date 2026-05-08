const express = require('express');
const router = express.Router();
const { getPressMedia, updatePressMedia } = require('../controllers/pressMediaController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPressMedia);
router.put('/', protect, updatePressMedia);

module.exports = router;
