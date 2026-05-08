const express = require('express');
const router = express.Router();
const { getWhyChooseUs, updateWhyChooseUs } = require('../controllers/whyChooseUsController');

router.get('/', getWhyChooseUs);
router.put('/', updateWhyChooseUs);

module.exports = router;
