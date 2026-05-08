const express = require('express');
const router = express.Router();
const { getGradeSlider, updateGradeSlider } = require('../controllers/gradeSliderController');

router.get('/', getGradeSlider);
router.put('/', updateGradeSlider);

module.exports = router;
