const express = require('express');
const router = express.Router();
const { getScienceDmc, updateScienceDmc } = require('../controllers/scienceDmcController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getScienceDmc);
router.put('/', protect, updateScienceDmc);

module.exports = router;
