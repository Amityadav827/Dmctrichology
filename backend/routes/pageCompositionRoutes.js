const express = require('express');
const { getPageBySlug, updatePageComposition } = require('../controllers/pageCompositionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:slug', getPageBySlug);
router.put('/:slug', protect, updatePageComposition);

module.exports = router;
