const express = require('express');
const router = express.Router();
const { getResultsSlider, updateResultsSlider } = require('../controllers/resultsSliderController');

router.get('/', getResultsSlider);
router.put('/', updateResultsSlider);

module.exports = router;
