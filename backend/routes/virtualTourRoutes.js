const express = require('express');
const router = express.Router();
const { getVirtualTour, updateVirtualTour } = require('../controllers/virtualTourController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getVirtualTour);
router.put('/', protect, updateVirtualTour);

module.exports = router;
