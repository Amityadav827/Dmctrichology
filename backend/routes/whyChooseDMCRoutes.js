const express = require('express');
const router = express.Router();
const { getWhyChooseDMC, updateWhyChooseDMC } = require('../controllers/whyChooseDMCController');

router.get('/', getWhyChooseDMC);
router.put('/', updateWhyChooseDMC);

module.exports = router;
