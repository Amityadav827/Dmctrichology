const express = require('express');
const router = express.Router();
const { getServices, updateServices } = require('../controllers/serviceController');

router.get('/', getServices);
router.put('/', updateServices);

module.exports = router;
